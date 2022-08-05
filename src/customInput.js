(function () {

    class CustomInput {
        static init() {
            this.getCheckbox().addEventListener('change', () => {
                const val = this.getCheckbox().checked;
                NNKPZ.MainSVG.customMode = val;
                this.showTextArea(val);
                NNKPZ.Dom.onChangeTetro();
            });
            this.getButtonRefresh().addEventListener('click', () => {
                const input = NNKPZ.Tetro.tetroToInput(NNKPZ.MainSVG.customTetro);
                this.getTextArea().value = input;
            });
            this.getButtonExport().addEventListener('click', () => {
                const input = this.getTextArea().value;
                if (this.getBins(input) == null) {
                    return;
                }
                NNKPZ.Dom.download(input);
            });
            this.getButtonImport().addEventListener('click', () => {
                NNKPZ.Dom.upload((input) => {
                    if (input) {
                        if (this.getBins(input) == null) {
                            return;
                        }
                        const el = CustomInput.getTextArea();
                        el.value = input;
                        CustomInput.getButton().dispatchEvent(new Event('click'));
                    }
                    else {
                        alert('Unable to read data.');
                    }
                });
            });
            this.getButton().addEventListener('click', () => {
                const input = this.getTextArea().value;
                const bins = this.getBins(input);
                if (bins == null) {
                    return;
                }
                NNKPZ.MainSVG.customTetro = NNKPZ.Tetro.binsToTetro(bins);
                NNKPZ.Dom.onChangeTetro();
                NNKPZ.MainRange.calculate();
            });
        }
        static getBins(input) {
            const bins = this.parseInput(input);
            if (bins == null) {
                alert('Invalid Format.');
                return null;
            }
            return bins;
        }
        static setCheckbox(val) {
            const el = this.getCheckbox();
            el.checked = val;
            el.dispatchEvent(new Event('change'));
        }
        static showTextArea(show) {
            if (show) {
                this.getDivInner().style.display = '';
            }
            else {
                this.getDivInner().style.display = 'none';
            }
        }
        static parseInput(input) {
            let trimmed = input.trim();
            const sList = trimmed.split('\n');
            if (sList.length != 9) {
                return null;
            }
            const bins = [];
            for (const s of sList) {
                if (s.length != 9 || !/^[01]+$/.test(s)) {
                    return null;
                }
                bins.push(parseInt(s, 2));
            }
            return bins;
        }
        static getCheckbox() {
            return document.getElementById('_checkbox_custom');
        }
        static getDivInner() {
            return document.getElementById('_div_custom_inner');
        }
        static getTextArea() {
            return document.getElementById('_textarea_custom');
        }
        static getButtonRefresh() {
            return document.getElementById('_button_custom_refresh');
        }
        static getButtonExport() {
            return document.getElementById('_button_custom_export');
        }
        static getButtonImport() {
            return document.getElementById('_button_custom_import');
        }
        static getButton() {
            return document.getElementById('_button_custom');
        }
    }

    NNKPZ.CustomInput = CustomInput;

}());