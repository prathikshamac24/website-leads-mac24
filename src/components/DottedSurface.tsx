"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";

interface DottedSurfaceProps {
  className?: string;
  width?: string;
  height?: string;
}

export function DottedSurface({
  className = "",
  width = "100%",
  height = "100%",
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const spacing = 150;
    const rows = 40;
    const cols = 60;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 355, 1220);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(scene.fog.color, 0);

    // Geometry & Attributes
    const positions: number[] = [];
    const colors: number[] = [];
    const geometry = new THREE.BufferGeometry();

    for (let u = 0; u < rows; u++) {
      for (let i = 0; i < cols; i++) {
        const xCoord = u * spacing - (rows * spacing) / 2;
        const yCoord = 0;
        const zCoord = i * spacing - (cols * spacing) / 2;
        positions.push(xCoord, yCoord, zCoord);
        
        // White / light grey color matching the sleek dark background theme
        colors.push(0.8, 0.8, 0.8);
      }
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute(
      "color",
      new THREE.Float32BufferAttribute(colors, 3)
    );

    // Points Material
    const material = new THREE.PointsMaterial({
      size: 8,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const positionAttr = geometry.attributes.position;
      const array = positionAttr.array as Float32Array;

      let idx = 0;
      for (let u = 0; u < rows; u++) {
        for (let i = 0; i < cols; i++) {
          const arrayIdx = idx * 3;
          // Sine-wave coordinate height oscillation matching the exact reference math
          array[arrayIdx + 1] =
            Math.sin((u + count) * 0.3) * 50 + Math.sin((i + count) * 0.5) * 50;
          idx++;
        }
      }

      positionAttr.needsUpdate = true;
      renderer.render(scene, camera);
      count += 0.1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);

      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isClient]);

  if (!isClient) {
    return <div className={`overflow-hidden pointer-events-none ${className}`} style={{ width, height }} />;
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden pointer-events-none ${className}`}
      style={{ width, height }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
