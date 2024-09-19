import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";

const CONSTELLATION_LINE_COLOR = 0x424242;
const STARS_COLOR_MAP = {
  O: 0x9bb0ff,
  B: 0xaabfff,
  A: 0xcad7ff,
  F: 0xf8f7ff,
  G: 0xfff4e8,
  K: 0xffddb4,
  M: 0xffaa6a,
  DEFAULT: 0xffffff,
};

export default function Constellations() {
  const stars = useRef({});
  const { scene } = useThree();

  useEffect(() => {
    // Load stars
    fetch("/data/bsc5.dat")
      .then(response => response.text())
      .then(data => {
        const starData = data.split("\n");
        const starsTemp = [];
        const positions = [];
        const colors = [] as number[];
        const sizes = [];
        const color = new THREE.Color();
        const starsMaterial = new THREE.ShaderMaterial({
          vertexShader: vertexShader(),
          fragmentShader: fragmentShader(),
          transparent: true,
        });

        starData.forEach(row => {
          const star = {
            id: Number(row.slice(0, 4)),
            name: row.slice(4, 14).trim(),
            gLon: Number(row.slice(90, 96)),
            gLat: Number(row.slice(96, 102)),
            mag: Number(row.slice(102, 107)),
            spectralClass: row.slice(129, 130),
            v: new THREE.Vector3(),
          };

          star.v = new THREE.Vector3().setFromSphericalCoords(
            100,
            ((90 - star.gLat) / 180) * Math.PI,
            (star.gLon / 180) * Math.PI
          );

          positions.push(star.v.x, star.v.y, star.v.z);
          color.setHex(
            STARS_COLOR_MAP[star.spectralClass] ?? STARS_COLOR_MAP.DEFAULT
          );

          const s = (star.mag * 26) / 255 + 0.18;
          sizes.push(s);
          colors.push(color.r, color.g, color.b, s);
          starsTemp.push(star);
        });
        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(positions, 3)
        );
        starsGeometry.setAttribute(
          "color",
          new THREE.Float32BufferAttribute(colors, 4)
        );
        starsGeometry.setAttribute(
          "size",
          new THREE.Float32BufferAttribute(sizes, 1)
        );

        const points = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(points);

        // setStarsData({ positions, colors, sizes });

        stars.current = starsTemp.reduce((acc, star) => {
          acc[star.id] = star;
          return acc;
        }, {});
      });

    // Load constellations
    fetch("/data/ConstellationLines.dat")
      .then(response => response.text())
      .then(data => {
        const constellationLinesData = data.split("\n");

        constellationLinesData.forEach(row => {
          if (!row.startsWith("#") && row.length > 1) {
            const rowData = row.split(/[ ,]+/);
            const points = [];

            for (let i = 0; i < rowData.length - 2; i++) {
              const starId = parseInt(rowData[i + 2].trim());
              if (starId in stars.current) {
                const star = stars.current[starId];
                points.push(star.v);
              }
            }

            if (points.length > 1) {
              const constellationGeometry =
                new THREE.BufferGeometry().setFromPoints(points);
              const constellationMaterial = new THREE.LineBasicMaterial({
                color: CONSTELLATION_LINE_COLOR,
              });
              const constellationLine = new THREE.Line(
                constellationGeometry,
                constellationMaterial
              );
              constellationLine.userData.type = "constellationLine";
              scene.add(constellationLine);
            }
          }
        });
      });
  }, []);

  return null;
}

function vertexShader() {
  return `
    attribute float size;
    attribute vec4 color;
    varying vec4 vColor;
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
}

function fragmentShader() {
  return `
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;
}
