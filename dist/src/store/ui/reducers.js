"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialState = void 0;
const connect_1 = require("../../connect");
const docReducer_1 = __importDefault(require("./docReducer"));
const types_1 = require("./types");
exports.initialState = {
    docs: {},
};
function getHeight(id) {
    var _a, _b;
    return (_b = (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.offsetHeight) !== null && _b !== void 0 ? _b : 0;
}
function getAnchorHeight(anchor) {
    const el = anchor === null || anchor === void 0 ? void 0 : anchor.element;
    let height = el === null || el === void 0 ? void 0 : el.offsetHeight;
    if (!height) {
        const parent = el === null || el === void 0 ? void 0 : el.parentNode;
        height = parent === null || parent === void 0 ? void 0 : parent.offsetHeight;
    }
    return height || 0;
}
function getTopLeft(anchor) {
    var _a;
    let el = anchor === null || anchor === void 0 ? void 0 : anchor.element;
    let top = 0;
    let left = 0;
    do {
        top += (el === null || el === void 0 ? void 0 : el.offsetTop) || 0;
        left += (el === null || el === void 0 ? void 0 : el.offsetLeft) || 0;
        el = ((_a = el === null || el === void 0 ? void 0 : el.offsetParent) !== null && _a !== void 0 ? _a : null);
    } while (el && el.tagName !== 'ARTICLE');
    return { top, left };
}
function placeSidenotes(state, actionType) {
    var _a;
    let findMe;
    let boundaryElementTop;
    if (connect_1.opts.preserveBoundaries) {
        for (const [, sidenote] of Object.entries(state.sidenotes)) {
            if (sidenote && sidenote.element) {
                const boundaryElement = (_a = sidenote.element) === null || _a === void 0 ? void 0 : _a.closest('[data-sidenotes-boundary]');
                if (boundaryElement) {
                    boundaryElementTop = boundaryElement.offsetTop;
                }
                break;
            }
        }
    }
    const sorted = Object.entries(state.sidenotes).map(([id, cmt]) => {
        var _a, _b, _c;
        const anchor = (_b = state.anchors[(_a = cmt.inlineAnchors) === null || _a === void 0 ? void 0 : _a[0]]) !== null && _b !== void 0 ? _b : state.anchors[(_c = cmt.baseAnchors) === null || _c === void 0 ? void 0 : _c[0]];
        const { top, left } = getTopLeft(anchor);
        const height = getHeight(id);
        const loc = [id, {
                top: id === state.selectedSidenote ? top - height / 2 + getAnchorHeight(anchor) / 2 : top,
                left,
                height,
                boundaryElementTop,
                order: cmt.order,
            }];
        if (id === state.selectedSidenote) {
            findMe = loc;
        }
        return loc;
    }).sort((a, b) => {
        if (a[1].order && b[1].order)
            return a[1].order < b[1].order ? -1 : 1;
        if (a[1].top === b[1].top)
            return a[1].left - b[1].left;
        return a[1].top - b[1].top;
    });
    const idx = findMe ? sorted.indexOf(findMe) : 0;
    const before = sorted.slice(0, idx + 1).reduceRight((prev, [id, loc], index) => {
        var _a, _b;
        const { top } = (_b = (_a = prev[prev.length - 1]) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : {};
        let newTop = Math.min(top - loc.height - connect_1.opts.padding, loc.top) || loc.top;
        if (connect_1.opts.preserveBoundaries && loc.boundaryElementTop) {
            newTop = Math.max(newTop, loc.boundaryElementTop + index * connect_1.opts.padding);
        }
        const next = [id, { top: newTop, height: loc.height }];
        return [...prev, next];
    }, []);
    const after = sorted.slice(idx).reduce((prev, [id, loc]) => {
        var _a, _b;
        const { top, height } = (_b = (_a = prev[prev.length - 1]) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : {};
        let newTop = Math.max(top + height + connect_1.opts.padding, loc.top) || loc.top;
        if (connect_1.opts.preserveBoundaries && loc.boundaryElementTop) {
            newTop = Math.max(newTop, loc.boundaryElementTop);
        }
        const next = [id, { top: newTop, height: loc.height }];
        return [...prev, next];
    }, []);
    const idealPlacement = Object.fromEntries([...before, ...after]);
    let hasChanges = false;
    const sidenotes = Object.fromEntries(Object.entries(state.sidenotes).map(([id, comment]) => {
        const { top } = idealPlacement[id];
        if (comment.top !== top) {
            hasChanges = true;
            return [id, Object.assign(Object.assign({}, comment), { top })];
        }
        return [id, comment];
    }));
    if (!hasChanges)
        return state;
    return Object.assign(Object.assign({}, state), { sidenotes });
}
const uiReducer = (state = exports.initialState, action) => {
    switch (action.type) {
        case types_1.UI_SELECT_SIDENOTE:
        case types_1.UI_SELECT_ANCHOR:
        case types_1.UI_CONNECT_SIDENOTE:
        case types_1.UI_CONNECT_ANCHOR:
        case types_1.UI_CONNECT_ANCHOR_BASE:
        case types_1.UI_DISCONNECT_ANCHOR:
        case types_1.UI_DESELECT_SIDENOTE:
        case types_1.UI_REPOSITION_SIDENOTES:
            {
                const { docId } = action.payload;
                const nextDoc = placeSidenotes(docReducer_1.default(state.docs[docId], action), action.type);
                return Object.assign(Object.assign({}, state), { docs: Object.assign(Object.assign({}, state.docs), { [docId]: nextDoc }) });
            }
        case types_1.UI_RESET_ALL_SIDENOTES: {
            return Object.assign(Object.assign({}, state), { docs: {} });
        }
        default:
            return state;
    }
};
exports.default = uiReducer;
//# sourceMappingURL=reducers.js.map