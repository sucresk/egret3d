namespace examples {

    export class RaycastTest {

        async start() {
            // Load resource config.
            await RES.loadConfig("default.res.json", "resource/");

            // Create camera.
            egret3d.Camera.main;

            { // Create light.
                const gameObject = paper.GameObject.create("Light");
                gameObject.transform.setLocalPosition(1.0, 10.0, -1.0);
                gameObject.transform.lookAt(egret3d.Vector3.ZERO);

                const light = gameObject.addComponent(egret3d.DirectionalLight);
                light.intensity = 0.5;
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.TRIANGLE, "TriangleMesh");
                gameObject.transform.setLocalPosition(0.0, 3.0, 0.0);
                gameObject.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

                const line = paper.GameObject.create("MeshRendererRaycast");
                line.transform.setLocalPosition(0.0, 3.0, -2.0);
                line.addComponent(behaviors.RotateComponent).target = gameObject;
                const rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                rendererRaycast.raycastMesh = true;
                rendererRaycast.target = gameObject;

                //
                rendererRaycast.target.addComponent(MeshTriangleFollower).rendererRaycaster = rendererRaycast;
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.CYLINDER, "CylinderMesh");
                gameObject.transform.setLocalPosition(0.0, 0.0, 0.0);
                gameObject.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

                const line = paper.GameObject.create("MeshRendererRaycast");
                line.transform.setLocalPosition(0.0, 0.0, -2.0);
                line.addComponent(behaviors.RotateComponent).target = gameObject;
                const rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                rendererRaycast.raycastMesh = true;
                rendererRaycast.target = gameObject;
            }

            {
                // Load prefab resource.
                await RES.getResAsync("Assets/C_xiaohuangren_D_01_ANIM.prefab.json");
                // Create prefab.
                const gameObject = paper.Prefab.create("Assets/C_xiaohuangren_D_01_ANIM.prefab.json")!;
                gameObject.transform.setLocalPosition(-3.0, 0.0, 0.0);
                gameObject.getComponentInChildren(egret3d.Animation)!.play("run01");

                const line = paper.GameObject.create("SkinnedMeshRendererRaycast");
                line.transform.setLocalPosition(-3.0, 0.5, -2.0);
                const rendererRaycast = line.addComponent(behaviors.RendererRaycast);
                rendererRaycast.raycastMesh = true;
                rendererRaycast.target = gameObject.getComponentInChildren(egret3d.SkinnedMeshRenderer)!.gameObject;

                //
                rendererRaycast.target.addComponent(MeshTriangleFollower).rendererRaycaster = rendererRaycast;
            }

            {
                const gameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.PYRAMID, "Collider");
                gameObject.transform.setLocalPosition(3.0, 0.0, 0.0);
                gameObject.renderer!.material = egret3d.DefaultMaterials.MESH_LAMBERT;

                {
                    const boxCollider = gameObject.addComponent(egret3d.BoxCollider);
                    boxCollider.box.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
                    boxCollider.box.center = egret3d.Vector3.create(0.0, 0.0, 2.0).release();
                }

                {
                    const boxCollider = gameObject.addComponent(egret3d.BoxCollider);
                    boxCollider.box.size = egret3d.Vector3.create(2.0, 2.0, 2.0).release();
                    boxCollider.box.center = egret3d.Vector3.create(0.0, 0.0, -2.0).release();
                }

                {
                    const sphereCollider = gameObject.addComponent(egret3d.SphereCollider);
                    sphereCollider.sphere.radius = 1.0;
                    sphereCollider.sphere.center.set(1.0, 0.0, 0.0);
                }

                {
                    const cylinderCollider = gameObject.addComponent(egret3d.CylinderCollider);
                    cylinderCollider.topRadius = 1.0;
                    cylinderCollider.bottomRadius = 1.0;
                    cylinderCollider.center.set(-1.0, 0.0, 0.0);
                }

                const line = paper.GameObject.create("ColliderRaycast");
                line.transform.setLocalPosition(3.0, 2.0, -2.0);
                line.addComponent(behaviors.RotateComponent).target = gameObject;
                line.addComponent(behaviors.ColliderRaycast).target = gameObject;
            }
        }
    }

    class MeshTriangleFollower extends paper.Behaviour {
        public rendererRaycaster: behaviors.RendererRaycast | null = null;

        private readonly _normal: paper.GameObject = egret3d.DefaultMeshes.createObject(egret3d.DefaultMeshes.LINE_Z, "SkinnedMeshTriangleFollower");

        public onUpdate() {
            if (!this.rendererRaycaster) {
                this._normal.activeSelf = false;
                return;
            }

            // const triangleIndex = this.rendererRaycaster.raycastInfo.triangleIndex;
            // if (triangleIndex < 0) {
            //     this._normal.activeSelf = false;
            //     return;
            // }

            const raycastInfo = this.rendererRaycaster.raycastInfo;
            const meshRender = this.rendererRaycaster.target!.renderer! as (egret3d.MeshRenderer | egret3d.SkinnedMeshRenderer);


            const coord = raycastInfo.coord;
            const triangleIndex = raycastInfo.triangleIndex;



            
            const triangle = meshRender.getTriangle(triangleIndex).release();
            triangle.getPointAt(coord.x, coord.y).release();



            this._normal.transform.position = triangle.getPointAt(coord.x, coord.y).release();
            this._normal.transform.lookRotation(triangle.getNormal().release());
            this._normal.activeSelf = true;
        }

        // public getPointAt(triangle: egret3d.Triangle, u: number, v: number, out?: egret3d.Vector3): egret3d.Vector3 {
        //     if (!out) {
        //         out = egret3d.Vector3.create();
        //     }

        //     out.x = egret3d.math.lerp(triangle.a.x, triangle.c.x, u) + egret3d.math.lerp(0.0, triangle.b.x - triangle.a.x, v);
        //     out.y = egret3d.math.lerp(triangle.a.y, triangle.b.y, v) + egret3d.math.lerp(0.0, triangle.c.y - triangle.a.y, u);
        //     out.z = egret3d.math.lerp(triangle.a.z, triangle.c.z, u) + egret3d.math.lerp(0.0, triangle.b.z - triangle.a.z, v);

        //     return out;
        // }
    }
}