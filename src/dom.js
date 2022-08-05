(function () {

    class Dom {
        static init() {
            NNKPZ.MainSVG.init();
            NNKPZ.MainRange.init();
            NNKPZ.ResultTable.init();
            NNKPZ.ArrangementRange.init();
            NNKPZ.CustomInput.init();
            this.onChangeTetro();
        }
        static onChangeTetro() {
            $('#_label_puzzle_title').text(this.getTetroName());
            NNKPZ.MainSVG.drawTetro(this.getTetro());
            NNKPZ.ResultTable.reset();
        }
        static getTetro() {
            if (NNKPZ.MainSVG.customMode) {
                return NNKPZ.MainSVG.customTetro;
            }
            const index = NNKPZ.MainRange.getIndex();
            return NNKPZ.data.presets[index].data;
        }
        static getTetroName() {
            if (NNKPZ.MainSVG.customMode) {
                return "Custom";
            }
            const index = NNKPZ.MainRange.getIndex();
            if(NNKPZ.data.presets[index].name === undefined) {
                return "- Unreleased -";
            }

            return NNKPZ.data.presets[index].name;
        }
        static getTetroColor() {
            if (NNKPZ.MainSVG.customMode) {
                return NNKPZ.TileColors.Default;
            }
            const index = NNKPZ.MainRange.getIndex();
            if(NNKPZ.data.presets[index].color === undefined) {
                return NNKPZ.TileColors.Default;
            }

            return NNKPZ.data.presets[index].color;
        }
        static onChangeSols(sols) {
            NNKPZ.ArrangementRange.applySols(sols);
        }
        static onChangeArrange(index) {
            NNKPZ.MainSVG.drawSolution(this.getTetro(), NNKPZ.ResultTable.getCurrentSols()[index], this.getTetroColor());
        }
        static download(input) {
            const el = document.getElementById('_tetro_download');
            el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(input));
            el.click();
        }
        static upload(callback) {
            const el = document.getElementById('_tetro_upload');
            el.onchange = () => {
                if (el.files && el.files.length >= 1 && el.files[0]) {
                    const file = el.files[0];
                    const reader = new FileReader();
                    reader.onload = () => {
                        var _a;
                        callback((_a = reader.result) === null || _a === void 0 ? void 0 : _a.toString());
                    };
                    reader.readAsText(file);
                    el.value = '';
                }
            };
            el.click();
        }
    }

    NNKPZ.Dom = Dom;

}());