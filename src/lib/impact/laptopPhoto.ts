import * as THREE from "three";

/** Use a real laptop photo (transparent PNG in /public) instead of the procedural laptop. */
export function createPhotoLaptop(url: string) {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 3), mat);
  group.add(mesh);
  new THREE.TextureLoader().load(url, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    mat.map = tex;
    mat.needsUpdate = true;
    const aspect = tex.image.width / tex.image.height;
    mesh.geometry.dispose();
    mesh.geometry = new THREE.PlaneGeometry(4.6, 4.6 / aspect);
  });
  return { group, update: (T: number) => { group.position.y = Math.sin(T * 0.9) * 0.06; } };
}
