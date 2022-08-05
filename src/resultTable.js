(function () {

    class ResultTable {
        static init() {
            this.initHeader();
            this.initSort();
            this.initFilter();
        }
        static initHeader() {
            const groups = this.getHeaderShapeGroups();
            const size = 25;
            const attr = { 'stroke-width': size, 'stroke-linecap': 'square', class: '_table_block' };
            NNKPZ.SVG.drawBlock(groups[0], NNKPZ.data.shapes[0].blockLine, attr, size, { x: 62.5, y: 37.5 });
            NNKPZ.SVG.drawBlock(groups[1], NNKPZ.data.shapes[1].blockLine, attr, size, { x: 50, y: 12.5 });
            NNKPZ.SVG.drawBlock(groups[2], NNKPZ.data.shapes[4].blockLine, attr, size, { x: 62.5, y: 25 });
            NNKPZ.SVG.drawBlock(groups[3], NNKPZ.data.shapes[9].blockLine, attr, size, { x: 62.5, y: 25 });
            NNKPZ.SVG.drawBlock(groups[4], NNKPZ.data.shapes[13].blockLine, attr, size, { x: 62.5, y: 25 });
            NNKPZ.SVG.drawBlock(groups[5], NNKPZ.data.shapes[16].blockLine, attr, size, { x: 62.5, y: 25 });
            NNKPZ.SVG.drawBlock(groups[6], NNKPZ.data.shapes[18].blockLine, attr, size, { x: 62.5, y: 25 });
        }
        static initSort() {
            this.getHeaderSortTds().forEach((el, i) => {
                el.addEventListener('click', () => {
                    this.sortState[i] = !this.sortState[i];
                    this.onToggleSort(i);
                });
            });
        }
        static onToggleSort(i) {
            if (this.sortState[i]) {
                this.solMapList.sort((a, b) => a[0].charCodeAt(i) - b[0].charCodeAt(i));
                this.keyList.sort((a, b) => a.charCodeAt(i) - b.charCodeAt(i));
            }
            else {
                this.solMapList.sort((a, b) => b[0].charCodeAt(i) - a[0].charCodeAt(i));
                this.keyList.sort((a, b) => b.charCodeAt(i) - a.charCodeAt(i));
            }
            this.getHeaderSortTds().forEach((el, i) => (el.innerHTML = this.sortState[i] ? '▲' : '▼'));
            this.buildBody();
            this.getTableBody().scrollTo({ top: 0 });
        }
        static initFilter() {
            this.getMinFilters().forEach((el, i) => {
                el.addEventListener('input', (e) => {
                    const el = e.currentTarget;
                    this.filterState[i][0] = parseInt(el.value);
                    this.onChangeFilter();
                });
            });
            this.getMaxFilters().forEach((el, i) => {
                el.addEventListener('input', (e) => {
                    const el = e.currentTarget;
                    this.filterState[i][1] = parseInt(el.value);
                    this.onChangeFilter();
                });
            });
        }
        static onChangeFilter() {
            this.keyList = this.solMapList.reduce((arr, item) => {
                for (let i = 0; i < this.filterState.length; i++) {
                    const n = item[0].charCodeAt(i);
                    const fMin = this.filterState[i][0];
                    const fMax = this.filterState[i][1];
                    if (n < fMin || n > fMax) {
                        return arr;
                    }
                }
                arr.push(item[0]);
                return arr;
            }, []);
            this.buildBody();
        }
        static reset() {
            this.solMapList = [];
            this.keyList = [];
            this.selectedIndex = 0;
            this.sortState.forEach((_v, i, arr) => (arr[i] = true));
            this.getHeaderSortTds().forEach((el) => (el.innerHTML = '▲'));
            this.filterState.forEach((_v, i, arr) => ((arr[i][0] = 0), (arr[i][1] = 0)));
            this.getMinFilters().forEach((el) => {
                el.min = '0';
                el.max = '0';
                el.value = '0';
            });
            this.getMaxFilters().forEach((el) => {
                el.min = '0';
                el.max = '0';
                el.value = '0';
            });
            this.getTableBody().innerHTML = '';
            NNKPZ.ArrangementRange.reset();
        }
        static buildBody() {
            const tBody = this.getTableBody();
            tBody.innerHTML = '';
            for (let j = 0; j < this.keyList.length; j++) {
                const key = this.keyList[j];
                const row = document.createElement('tr');
                const cell = document.createElement('td');
                cell.innerHTML = `${j + 1}`;
                row.appendChild(cell);
                for (let i = 0; i < key.length; i++) {
                    const cell = document.createElement('td');
                    const n = key.charCodeAt(i);
                    cell.innerHTML = `${n == 0 ? '' : n}`;
                    row.appendChild(cell);
                }
                const key_ = key;
                row.addEventListener('click', () => {
                    this.onClickRow(key_);
                });
                tBody.appendChild(row);
            }
            this.selectedIndex = 0;
            this.onChangeSelect();
        }
        static onClickRow(key) {
            this.selectedIndex = this.keyList.indexOf(key);
            this.onChangeSelect();
        }
        static onChangeSelect() {
            if (this.keyList.length == 0) {
                NNKPZ.Dom.onChangeSols([]);
                return;
            }
            const el = document.getElementsByClassName('_selected').item(0);
            el === null || el === void 0 ? void 0 : el.classList.remove('_selected');
            this.getTableBody().children.item(this.selectedIndex).classList.add('_selected');
            NNKPZ.Dom.onChangeSols(this.getCurrentSols());
        }
        static onCalculate(tetro) {
            this.sortState.forEach((_v, i, arr) => (arr[i] = true));
            this.getHeaderSortTds().forEach((el) => (el.innerHTML = '▲'));
            this.filterState.forEach((_v, i, arr) => ((arr[i][0] = 0), (arr[i][1] = 0)));
            this.getMinFilters().forEach((el) => (el.value = '0'));
            this.getMaxFilters().forEach((el) => (el.value = '0'));
            this.solMapList = NNKPZ.Tetro.getSolutionMapList(tetro);
            this.keyList = this.solMapList.map((item) => item[0]);
            this.buildBody();
            this.setMinMax();
        }
        static setMinMax() {
            if (this.solMapList.length == 0) {
                return;
            }
            const min = [100, 100, 100, 100, 100, 100, 100];
            const max = [0, 0, 0, 0, 0, 0, 0];
            this.solMapList.forEach((item) => {
                const key = item[0];
                for (let i = 0; i < key.length; i++) {
                    const n = key.charCodeAt(i);
                    if (n < min[i]) {
                        min[i] = n;
                    }
                    if (n > max[i]) {
                        max[i] = n;
                    }
                }
            });
            this.filterState.forEach((_v, i, arr) => ((arr[i][0] = min[i]), (arr[i][1] = max[i])));
            this.getMinFilters().forEach((el, i) => {
                el.min = `${min[i]}`;
                el.max = `${max[i]}`;
                el.value = `${min[i]}`;
            });
            this.getMaxFilters().forEach((el, i) => {
                el.min = `${min[i]}`;
                el.max = `${max[i]}`;
                el.value = `${max[i]}`;
            });
        }
        static getCurrentSols() {
            const key = this.keyList[this.selectedIndex];
            return this.solMapList.find((item) => item[0] == key)[1];
        }
        static getTds(trId) {
            const tr = document.getElementById(trId);
            const els = [...tr.children];
            els.shift();
            return els;
        }
        static getHeaderShapeGroups() {
            return this.getTds('_tr_shape').map((el) => el.firstElementChild.firstElementChild);
        }
        static getHeaderSortTds() {
            return this.getTds('_tr_sort');
        }
        static getTableBody() {
            return document.getElementById('_table_body');
        }
        static getMinFilters() {
            return this.getTds('_tr_min_filter').map((el) => el.firstElementChild);
        }
        static getMaxFilters() {
            return this.getTds('_tr_max_filter').map((el) => el.firstElementChild);
        }
    }

    ResultTable.sortState = [true, true, true, true, true, true, true];
    ResultTable.filterState = [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0]
    ];
    ResultTable.solMapList = [];
    ResultTable.keyList = [];
    ResultTable.selectedIndex = 0;

    NNKPZ.ResultTable = ResultTable;

}());