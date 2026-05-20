'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

/* ─── Per-variant Three.js color data ───────────────────────────────────── */
const VARIANT_COLORS = [
  { bottle: '#3d1575', emissive: '#1a0840', light: '#7030c8' }, // purple
  { bottle: '#0d4020', emissive: '#051508', light: '#1a8a40' }, // green
  { bottle: '#720a1c', emissive: '#380510', light: '#c0203c' }, // crimson
  { bottle: '#7a4808', emissive: '#3a2005', light: '#c48020' }, // amber
] as const

export function ProductCanvas({ variant }: { variant: number }) {
  const mountRef   = useRef<HTMLDivElement>(null)
  const matRef     = useRef<THREE.MeshStandardMaterial | null>(null)
  const capMatRef  = useRef<THREE.MeshStandardMaterial | null>(null)
  const accentRef  = useRef<THREE.PointLight | null>(null)

  /* ── Scene setup (once) ─────────────────────────────────────────────── */
  useEffect(() => {
    const container = mountRef.current
    if (!container) return
    const { width, height } = container.getBoundingClientRect()

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    /* Scene + camera */
    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
    camera.position.set(0, 0, 4.4)

    /* ── Bottle profile (surface of revolution) ── */
    const pts: THREE.Vector2[] = [
      new THREE.Vector2(0.00, -1.28),
      new THREE.Vector2(0.38, -1.22),
      new THREE.Vector2(0.56, -1.06),
      new THREE.Vector2(0.65, -0.72),
      new THREE.Vector2(0.70, -0.22),
      new THREE.Vector2(0.70,  0.22),
      new THREE.Vector2(0.64,  0.54),
      new THREE.Vector2(0.50,  0.74),
      new THREE.Vector2(0.24,  0.94),
      new THREE.Vector2(0.18,  1.12),
      new THREE.Vector2(0.22,  1.24),
      new THREE.Vector2(0.22,  1.34),
      new THREE.Vector2(0.00,  1.34),
    ]
    const bottleGeo = new THREE.LatheGeometry(pts, 72)
    bottleGeo.computeVertexNormals()

    const vc  = VARIANT_COLORS[0]
    const mat = new THREE.MeshStandardMaterial({
      color:            new THREE.Color(vc.bottle),
      roughness:        0.10,
      metalness:        0.82,
      emissive:         new THREE.Color(vc.emissive),
      emissiveIntensity: 0.55,
    })
    matRef.current = mat

    /* Cap / stopper */
    const capGeo = new THREE.CylinderGeometry(0.20, 0.22, 0.34, 36)
    const capMat = new THREE.MeshStandardMaterial({
      color:            new THREE.Color(vc.bottle),
      roughness:        0.26,
      metalness:        0.68,
      emissive:         new THREE.Color(vc.emissive),
      emissiveIntensity: 0.30,
    })
    capMatRef.current = capMat
    const cap = new THREE.Mesh(capGeo, capMat)
    cap.position.y = 1.34 + 0.17

    /* Group */
    const group = new THREE.Group()
    group.add(new THREE.Mesh(bottleGeo, mat), cap)
    group.position.x = -0.12
    scene.add(group)

    /* ── Lighting ─────────────────────────────────────────────────────── */
    // Ambient — cool blue fill (sky)
    scene.add(new THREE.AmbientLight(0x3a3a70, 0.60))

    // Key — warm, top-right-front
    const key = new THREE.DirectionalLight(0xfff2d8, 2.8)
    key.position.set(2.8, 3.8, 2.5)
    key.castShadow = true
    scene.add(key)

    // Accent — variant color, left-front
    const accent = new THREE.PointLight(new THREE.Color(vc.light), 2.0, 10)
    accent.position.set(-2.4, 0.6, 1.8)
    accentRef.current = accent
    scene.add(accent)

    // Rim — cold blue-white, back-top
    const rim = new THREE.DirectionalLight(0x8aaaff, 0.75)
    rim.position.set(-1.5, 2.5, -3.0)
    scene.add(rim)

    // Under-glow — warm amber from below
    const under = new THREE.PointLight(0xffa840, 0.45)
    under.position.set(0, -2.8, 1.0)
    scene.add(under)

    /* ── Animation loop ── */
    const clock = new THREE.Clock()
    let raf: number
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      group.rotation.y  = t * 0.34
      group.position.y  = Math.sin(t * 0.72) * 0.09
      renderer.render(scene, camera)
    }
    tick()

    /* ── Resize observer ── */
    const ro = new ResizeObserver(() => {
      const { width: w, height: h } = container.getBoundingClientRect()
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    ro.observe(container)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      renderer.dispose()
      mat.dispose()
      capMat.dispose()
      bottleGeo.dispose()
      capGeo.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  /* ── Color tween on variant change ─────────────────────────────────── */
  useEffect(() => {
    const mat    = matRef.current
    const capMat = capMatRef.current
    const light  = accentRef.current
    if (!mat || !light) return

    const vc       = VARIANT_COLORS[variant]
    const tBottle  = new THREE.Color(vc.bottle)
    const tEmissive = new THREE.Color(vc.emissive)
    const tLight   = new THREE.Color(vc.light)

    // Bottle color
    const bP = { r: mat.color.r, g: mat.color.g, b: mat.color.b }
    gsap.to(bP, {
      r: tBottle.r, g: tBottle.g, b: tBottle.b,
      duration: 1.2, ease: 'power2.inOut',
      onUpdate: () => {
        mat.color.setRGB(bP.r, bP.g, bP.b)
        capMat?.color.setRGB(bP.r, bP.g, bP.b)
      },
    })

    // Emissive
    const eP = { r: mat.emissive.r, g: mat.emissive.g, b: mat.emissive.b }
    gsap.to(eP, {
      r: tEmissive.r, g: tEmissive.g, b: tEmissive.b,
      duration: 1.2, ease: 'power2.inOut',
      onUpdate: () => {
        mat.emissive.setRGB(eP.r, eP.g, eP.b)
        capMat?.emissive.setRGB(eP.r, eP.g, eP.b)
      },
    })

    // Accent light
    const lP = { r: light.color.r, g: light.color.g, b: light.color.b }
    gsap.to(lP, {
      r: tLight.r, g: tLight.g, b: tLight.b,
      duration: 1.2, ease: 'power2.inOut',
      onUpdate: () => light.color.setRGB(lP.r, lP.g, lP.b),
    })
  }, [variant])

  return <div ref={mountRef} className="w-full h-full" />
}
