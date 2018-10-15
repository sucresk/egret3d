namespace paper.editor {
    /**
     * @internal
     */
    export class BoxColliderDrawer extends BaseSelectedGOComponent {
        private readonly _drawer: GameObject[] = [];

        public initialize() {
            super.initialize();
        }

        public update() {
            const selectedGameObject = super.update();
            const colliders = selectedGameObject ? selectedGameObject.getComponents(egret3d.BoxCollider) : null;

            for (let i = 0, l = Math.max(this._drawer.length, colliders ? colliders.length : 0); i < l; ++i) {
                if (i + 1 > this._drawer.length) {
                    const gameObject = EditorMeshHelper.createBox(`BoxCollider_${i}`, egret3d.Color.YELLOW, 0.5, paper.Scene.editorScene);
                    this._drawer.push(gameObject);
                }

                const drawer = this._drawer[i];

                if (!colliders || i + 1 > colliders.length) {
                    drawer.activeSelf = false;
                }
                else {
                    const collider = colliders[i];
                    if (collider.enabled) {
                        drawer.activeSelf = true;
                        drawer.transform.localPosition = egret3d.Vector3.create().copy(collider.aabb.center).applyMatrix(selectedGameObject!.transform.worldMatrix).release();
                        drawer.transform.localRotation = selectedGameObject!.transform.rotation;
                        drawer.transform.localScale = egret3d.Vector3.create().multiply(collider.aabb.size, selectedGameObject!.transform.scale).release();
                    }
                    else {
                        drawer.activeSelf = false;
                    }
                }
            }

            return selectedGameObject;
        }
    }
}