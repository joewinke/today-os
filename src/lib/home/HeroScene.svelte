<script lang="ts">
  /**
   * The WebGL centerpiece: an acquisition funnel rendered literally —
   * ~2600 glossy instanced particles (cobalt + chrome) pulled through a
   * vortex, ringed by a chrome torus at the mouth. Lazy-init on mount,
   * full dispose on destroy, static frame under reduced motion, and a
   * typographic-only fallback if WebGL is unavailable.
   *
   * Colors are read from the live DaisyUI theme tokens at runtime
   * (canvas-pixel trick converts any CSS color, incl. oklch) — no
   * literals in code.
   */
  import { onMount } from "svelte"

  let host: HTMLDivElement | null = $state(null)
  let failed = $state(false)

  /** Resolve a CSS custom property to linear-ish sRGB triplet via 2d canvas. */
  function cssColorToRgb(varName: string): [number, number, number] {
    const css = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    const c = document.createElement("canvas")
    c.width = c.height = 1
    const ctx = c.getContext("2d", { willReadFrequently: true })
    if (!ctx || !css) return [1, 1, 1]
    ctx.fillStyle = css
    ctx.fillRect(0, 0, 1, 1)
    const d = ctx.getImageData(0, 0, 1, 1).data
    return [d[0] / 255, d[1] / 255, d[2] / 255]
  }

  onMount(() => {
    let cancelled = false
    let cleanup: (() => void) | null = null

    ;(async () => {
      const el = host
      if (!el) return
      let THREE: typeof import("three")
      let RoomEnvironment: typeof import("three/examples/jsm/environments/RoomEnvironment.js").RoomEnvironment
      try {
        THREE = await import("three")
        ;({ RoomEnvironment } = await import(
          "three/examples/jsm/environments/RoomEnvironment.js"
        ))
      } catch {
        failed = true
        return
      }
      if (cancelled) return

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

      let renderer: import("three").WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        })
      } catch {
        failed = true
        return
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(el.clientWidth, el.clientHeight)
      renderer.domElement.setAttribute("aria-hidden", "true")
      el.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const pmrem = new THREE.PMREMGenerator(renderer)
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
      scene.environment = envTex

      // theme tokens → materials
      const [pr, pg, pb] = cssColorToRgb("--color-primary")
      const [cr, cg, cb] = cssColorToRgb("--color-base-content")
      const [br, bg, bb] = cssColorToRgb("--color-base-100")
      const cobalt = new THREE.Color().setRGB(pr, pg, pb, THREE.SRGBColorSpace)
      const chrome = new THREE.Color().setRGB(cr, cg, cb, THREE.SRGBColorSpace)
      const ink = new THREE.Color().setRGB(br, bg, bb, THREE.SRGBColorSpace)
      // Dull raw-stone gray for the rough intake, before the funnel polishes it.
      const rough = chrome.clone().multiplyScalar(0.34)

      scene.fog = new THREE.Fog(ink, 9, 17)

      const camera = new THREE.PerspectiveCamera(
        38,
        el.clientWidth / Math.max(el.clientHeight, 1),
        0.1,
        60,
      )
      camera.position.set(0, 2.7, 9.9)
      camera.lookAt(0, -0.3, 0)

      const key = new THREE.DirectionalLight(chrome, 1.4)
      key.position.set(4, 7, 3)
      scene.add(key)
      const under = new THREE.PointLight(cobalt, 26, 9)
      under.position.set(0, -3.0, 0.4)
      scene.add(under)

      const rig = new THREE.Group()
      rig.rotation.z = 0.1
      scene.add(rig)

      // composition: vortex sits right-of-center on wide screens so the
      // statement type owns the left; centered on small screens
      function composeRig() {
        const wide = el!.clientWidth >= 900
        rig.position.set(wide ? 2.1 : 0, 0.2, 0)
        const s = wide ? 0.92 : 0.78
        rig.scale.setScalar(s)
      }
      composeRig()

      // ---- funnel particle field ----
      const COUNT = 2600
      const MOUTH = 2.7
      const THROAT = 0.16
      const TOP = 2.25
      const SPAN = 3.7 // mouth → throat: the polishing funnel
      const T_INTAKE = 0.14 // first 14%: rough stones are drawn down into the mouth
      const T_OUT = 0.82 // last 18%: polished fine stones pour out below the throat
      const INTAKE_H = 1.9 // how far above the mouth the rough stones are drawn from
      const OUTPUT_DROP = 1.9 // how far fine stones fall out the bottom, into the underglow

      const geo = new THREE.IcosahedronGeometry(0.052, 0)
      const mat = new THREE.MeshStandardMaterial({
        color: chrome.clone(),
        metalness: 0.85,
        roughness: 0.18,
      })
      const mesh = new THREE.InstancedMesh(geo, mat, COUNT)
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      rig.add(mesh)

      const ts = new Float32Array(COUNT)
      const thetas = new Float32Array(COUNT)
      const speeds = new Float32Array(COUNT)
      const jitters = new Float32Array(COUNT)
      const scales = new Float32Array(COUNT)
      // Each particle's fully-refined color; the displayed color is this dimmed
      // by how far the particle has been refined (see placeParticle).
      const baseCol = new Float32Array(COUNT * 3)
      const dummy = new THREE.Object3D()
      const tint = new THREE.Color()

      for (let i = 0; i < COUNT; i++) {
        ts[i] = Math.random()
        thetas[i] = Math.random() * Math.PI * 2
        speeds[i] = 0.05 + Math.random() * 0.09
        jitters[i] = (Math.random() - 0.5) * 0.5
        scales[i] = 0.55 + Math.random() * 0.9
        // mostly cobalt gems (varied depth) + a few chrome sparkles
        if (Math.random() < 0.18) {
          tint.copy(chrome)
        } else {
          tint.copy(cobalt).multiplyScalar(0.7 + Math.random() * 0.6)
        }
        baseCol[i * 3] = tint.r
        baseCol[i * 3 + 1] = tint.g
        baseCol[i * 3 + 2] = tint.b
        mesh.setColorAt(i, tint)
      }
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

      function placeParticle(i: number) {
        const t = ts[i]
        let r: number, y: number
        // polish: 0 = rough raw stone (intake), 1 = fully polished fine stone (out)
        let polish: number
        if (t < T_INTAKE) {
          // Rough stones drawn in from the very top: fall from high + scattered and
          // spiral inward into the mouth. Still rough (unpolished).
          const ti = t / T_INTAKE
          const spread = 1 + 0.7 * (1 - ti)
          r = MOUTH * spread + jitters[i] * 1.3 * (1 - ti)
          y = TOP + INTAKE_H * (1 - ti)
          polish = 0
        } else if (t < T_OUT) {
          // Spun + polished down the funnel: mouth → throat.
          const tn = (t - T_INTAKE) / (T_OUT - T_INTAKE)
          const shrink = Math.pow(1 - tn, 1.8)
          r = THROAT + (MOUTH - THROAT) * shrink + jitters[i] * (1 - tn)
          y = TOP - SPAN * tn
          polish = tn
        } else {
          // Fine stones pour out of the throat, fan, and fall into the underglow.
          const to = (t - T_OUT) / (1 - T_OUT)
          r = THROAT + 0.34 * Math.sin(to * Math.PI) + jitters[i] * 0.12 * to
          y = TOP - SPAN - OUTPUT_DROP * to
          polish = 1
        }
        dummy.position.set(r * Math.cos(thetas[i]), y, r * Math.sin(thetas[i]))

        // Rough → fine: big lumpy asymmetric chunks that tumble, shrinking into
        // small symmetric faceted stones as they polish.
        const size = scales[i] * (1.15 - 0.62 * polish)
        const chunk = 1 - polish
        dummy.scale.set(
          size * (1 + jitters[i] * 2.4 * chunk),
          size * (1 - jitters[i] * 2.4 * chunk),
          size * (1 + Math.sin(thetas[i]) * 0.7 * chunk),
        )
        // Rough stones tumble erratically; polished stones settle into a clean spin.
        dummy.rotation.set(thetas[i] + chunk * 2.2, t * 6 + chunk * thetas[i] * 3, thetas[i] * 0.5)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)

        // Colour lerps dull-gray (rough) → vivid cobalt (polished), brightest as
        // the fine stones pour out.
        const bright = 0.32 + 0.95 * polish + (t >= T_OUT ? 0.28 : 0)
        const tr = baseCol[i * 3] * bright
        const tg = baseCol[i * 3 + 1] * bright
        const tb = baseCol[i * 3 + 2] * bright
        mesh.setColorAt(
          i,
          tint.setRGB(
            rough.r + (tr - rough.r) * polish,
            rough.g + (tg - rough.g) * polish,
            rough.b + (tb - rough.b) * polish,
          ),
        )
      }

      function stepParticles(dt: number) {
        for (let i = 0; i < COUNT; i++) {
          ts[i] += dt * speeds[i] * (0.5 + 1.6 * ts[i])
          if (ts[i] > 1) {
            ts[i] -= 1
            thetas[i] = Math.random() * Math.PI * 2
          }
          thetas[i] += dt * (0.45 + 2.6 * ts[i] * ts[i])
          placeParticle(i)
        }
        mesh.instanceMatrix.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
      }

      // ---- chrome rings ----
      const ringMat = new THREE.MeshStandardMaterial({
        color: chrome.clone(),
        metalness: 1,
        roughness: 0.1,
      })
      const mouthRing = new THREE.Mesh(new THREE.TorusGeometry(MOUTH + 0.12, 0.042, 24, 140), ringMat)
      mouthRing.rotation.x = Math.PI / 2
      mouthRing.position.y = TOP + 0.02
      rig.add(mouthRing)

      const throatRingMat = new THREE.MeshStandardMaterial({
        color: cobalt.clone(),
        metalness: 0.9,
        roughness: 0.14,
      })
      const throatRing = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.03, 20, 90), throatRingMat)
      throatRing.rotation.x = Math.PI / 2
      // The output aperture — refined gems pour out here into the underglow.
      throatRing.position.y = TOP - SPAN
      rig.add(throatRing)

      // ---- interaction / loop ----
      let raf = 0
      let visible = true
      let mx = 0
      let my = 0
      let px = 0
      let py = 0
      let last = performance.now()

      const onPointer = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth) * 2 - 1
        my = (e.clientY / window.innerHeight) * 2 - 1
      }

      function frame() {
        raf = requestAnimationFrame(frame)
        const now = performance.now()
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        if (!visible) return
        rig.rotation.y += dt * 0.14
        // Ease toward the cursor; snappier than before so the funnel visibly tracks.
        px += (mx - px) * 0.07
        py += (my - py) * 0.07
        // Tilt the vortex toward the pointer and give it a little roll — the mouth
        // now leans where you point instead of barely nudging.
        rig.rotation.x = -py * 0.24 + px * 0.06
        rig.rotation.z = 0.1 + px * 0.12
        // Stronger camera parallax so lateral movement swings the whole funnel.
        camera.position.x = px * 1.7
        camera.position.y = 2.7 - py * 0.9
        // Look slightly toward the cursor so the swing reads as depth, not just pan.
        camera.lookAt(px * 0.6, -0.3 - py * 0.3, 0)
        stepParticles(dt)
        renderer.render(scene, camera)
      }

      // settle the field so the first frame is a formed vortex
      for (let k = 0; k < 40; k++) stepParticles(1 / 30)

      const io = new IntersectionObserver(
        (entries) => {
          visible = entries[0]?.isIntersecting ?? true
        },
        { threshold: 0.02 },
      )
      io.observe(el)

      const ro = new ResizeObserver(() => {
        const w = el.clientWidth
        const h = Math.max(el.clientHeight, 1)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h)
        composeRig()
        if (reduced) renderer.render(scene, camera)
      })
      ro.observe(el)

      if (reduced) {
        renderer.render(scene, camera)
      } else {
        window.addEventListener("mousemove", onPointer, { passive: true })
        raf = requestAnimationFrame(frame)
      }

      cleanup = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener("mousemove", onPointer)
        io.disconnect()
        ro.disconnect()
        geo.dispose()
        mat.dispose()
        ringMat.dispose()
        throatRingMat.dispose()
        mouthRing.geometry.dispose()
        throatRing.geometry.dispose()
        envTex.dispose()
        pmrem.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
      if (cancelled) cleanup()
    })()

    return () => {
      cancelled = true
      cleanup?.()
    }
  })
</script>

{#if !failed}
  <div bind:this={host} class="scene-host" aria-hidden="true"></div>
{/if}

<style>
  .scene-host {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }
  .scene-host :global(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
