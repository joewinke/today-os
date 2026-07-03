import { describe, expect, it } from "vitest"
import {
  camShares,
  defaultFx,
  fmtDur,
  fxBadges,
  fxIsDefault,
  keptDuration,
  parseEdl,
  parseFx,
  personalizeSegs,
  rawDuration,
  segDur,
  serializeEdl,
  serializeFx,
  substituteTokens,
  tokenParts,
  type Lead,
} from "./edl"
import { FALLBACK_SUGGESTIONS, EFFECT_KEYS, FIXTURE_EDL, fixtureSegs } from "./fixtures"

describe("fx parsing", () => {
  it("parses '-' as default fx", () => {
    expect(parseFx("-")).toEqual(defaultFx())
    expect(parseFx("")).toEqual(defaultFx())
    expect(fxIsDefault(parseFx("-"))).toBe(true)
  })

  it("parses a full fx string", () => {
    const f = parseFx("z=1.15;kb=in;fi=0.40;fo=0.80;spd=0.50;look=warm")
    expect(f).toEqual({ z: 1.15, kb: "in", fi: 0.4, fo: 0.8, spd: 0.5, look: "warm" })
  })

  it("serializes default fx as '-'", () => {
    expect(serializeFx(defaultFx())).toBe("-")
  })

  it("fx round-trips through serialize/parse", () => {
    const f = parseFx("z=1.10;kb=out;fi=0.00;fo=0.50;spd=2.00;look=bw")
    expect(parseFx(serializeFx(f))).toEqual(f)
  })

  it("produces human badges for non-default fx", () => {
    const badges = fxBadges(parseFx("z=1.15;kb=in;fi=0.00;fo=0.80;spd=1.00;look=none"))
    expect(badges).toContain("1.15x zoom")
    expect(badges).toContain("kenburns in")
    expect(badges).toContain("fade-out")
    expect(fxBadges(defaultFx())).toEqual([])
  })
})

describe("EDL parse/serialize", () => {
  it("parses the fixture session", () => {
    const segs = fixtureSegs()
    expect(segs.length).toBe(18)
    expect(segs.filter((s) => !s.keep).length).toBe(4) // flubbed takes
    expect(segs[0]).toMatchObject({ idx: 0, keep: true, beat: "hook", cam: "talent" })
    expect(segs[0].caption).toBe("ONE STORM AWAY")
    expect(segs[1].keep).toBe(false)
    expect(segs[1].caption).toBe("")
    expect(segs[4].fx.z).toBeCloseTo(1.1)
  })

  it("round-trips a canonical EDL byte-identically", () => {
    const canonical = serializeEdl(fixtureSegs())
    expect(serializeEdl(parseEdl(canonical))).toBe(canonical)
  })

  it("emits 7-field lines (no trailing pipe) for caption-less segments", () => {
    const [line] = serializeEdl([
      { idx: 0, keep: true, beat: "hook", start: 0, end: 2, cam: "talent", fx: defaultFx(), text: "hi", caption: "" },
    ])
      .split("\n")
      .filter((l) => l.startsWith("KEEP"))
    expect(line).toBe("KEEP | hook | 0.00 | 2.00 | talent | - | hi")
    expect(line.split("|").length).toBe(7)
  })

  it("emits an 8th field only for a non-empty caption", () => {
    const [line] = serializeEdl([
      { idx: 0, keep: false, beat: "cta", start: 1, end: 3.5, cam: "gen", fx: defaultFx(), text: "go", caption: "TAP NOW" },
    ])
      .split("\n")
      .filter((l) => l.startsWith("CUT"))
    expect(line).toBe("CUT  | cta | 1.00 | 3.50 | gen | - | go | TAP NOW")
  })

  it("sanitizes reserved pipes out of free text", () => {
    const out = serializeEdl([
      { idx: 0, keep: true, beat: "x", start: 0, end: 1, cam: "talent", fx: defaultFx(), text: "a | b", caption: "c|d" },
    ])
    const seg = parseEdl(out)[0]
    expect(seg.text).toBe("a / b")
    expect(seg.caption).toBe("c/d")
    expect(serializeEdl(parseEdl(out))).toBe(out)
  })

  it("ignores comments, blanks, and malformed lines", () => {
    expect(parseEdl("# comment\n\nnot a line\nMAYBE | a | 0 | 1 | cam | - | x\n")).toEqual([])
  })

  it("parses legacy 6-field lines (no fx)", () => {
    const segs = parseEdl("KEEP | hook | 0.00 | 2.00 | talent | hello there\n")
    expect(segs[0].text).toBe("hello there")
    expect(fxIsDefault(segs[0].fx)).toBe(true)
  })
})

describe("timeline math", () => {
  const segs = fixtureSegs()

  it("computes kept vs raw durations", () => {
    expect(rawDuration(segs)).toBeCloseTo(105.8)
    expect(keptDuration(segs)).toBeCloseTo(85.6)
  })

  it("divides duration by playback speed", () => {
    const s = { ...segs[0], fx: { ...defaultFx(), spd: 2 } }
    expect(segDur(s)).toBeCloseTo((s.end - s.start) / 2)
  })

  it("camera shares sum to 1 over kept segments", () => {
    const shares = camShares(segs)
    const total = Object.values(shares).reduce((a, b) => a + b, 0)
    expect(total).toBeCloseTo(1)
    expect(shares.talent).toBeGreaterThan(shares.screen)
  })

  it("formats durations mono-style", () => {
    expect(fmtDur(85.6)).toBe("1:25.6")
    expect(fmtDur(5)).toBe("0:05.0")
  })
})

describe("personalization tokens", () => {
  const lead: Lead = {
    company: "Summit Roof Co",
    city: "Denver",
    vertical: "roofing",
    first_name: "Marcus",
    offer: "FREE 21-POINT INSPECTION",
  }

  it("substitutes {{tokens}}", () => {
    expect(substituteTokens("{{first_name}}, {{city}} slots fill fast", lead)).toBe(
      "Marcus, Denver slots fill fast",
    )
  })

  it("splits token parts for highlighting", () => {
    expect(tokenParts("Hi {{first_name}}!", lead)).toEqual([
      { text: "Hi ", sub: false },
      { text: "Marcus", sub: true },
      { text: "!", sub: false },
    ])
  })

  it("personalizes a whole cut without mutating the master", () => {
    const master = fixtureSegs()
    const cut = personalizeSegs(master, lead)
    expect(cut[13].caption).toBe("FREE 21-POINT INSPECTION - Denver")
    expect(master[13].caption).toBe("{{offer}} - {{city}}")
    expect(cut[16].text).toContain("Marcus")
  })

  it("kept EDL text still round-trips after personalization", () => {
    const out = serializeEdl(personalizeSegs(fixtureSegs(), lead))
    expect(serializeEdl(parseEdl(out))).toBe(out)
  })
})

describe("fixture integrity", () => {
  it("fixture EDL is already canonical (WYSIWYG text panel)", () => {
    const segs = parseEdl(FIXTURE_EDL)
    expect(segs.length).toBeGreaterThan(13)
  })

  it("fallback suggestions reference real segments and real assets", () => {
    const segs = fixtureSegs()
    for (const s of FALLBACK_SUGGESTIONS) {
      expect(s.segment).toBeGreaterThanOrEqual(0)
      expect(s.segment).toBeLessThan(segs.length)
      expect(segs[s.segment].keep).toBe(true) // never score a cut take
      if (s.effect === "zoom") expect(s.asset).toMatch(/^z=\d/)
      else expect(EFFECT_KEYS.has(s.asset)).toBe(true)
    }
  })
})
