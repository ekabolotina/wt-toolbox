//#region packages/core/src/lib/client/entityTypes.ts
var e = /* @__PURE__ */ function(e) {
	return e.UnknownEntity = "UnknownEntity", e.Int32Element = "Int32Element", e.ADField = "ADField", e.ADMessage = "ADMessage", e.VariantTypeElement = "VariantTypeElement", e.ZoneConnectionInfo = "ZoneConnectionInfo", e.VolumeForPrice = "VolumeForPrice", e.VolumeForPriceFractional = "VolumeForPriceFractional", e.ClientRestrictions = "ClientRestrictions", e.ChartSequenceBegin = "ChartSequenceBegin", e.ClientEnterOrderExReq = "ClientEnterOrderExReq", e.ClientCancelOrderExReq = "ClientCancelOrderExReq", e.ClientEnterOrderExRsp = "ClientEnterOrderExRsp", e.ClientCancelOrderExRsp = "ClientCancelOrderExRsp", e.ChartSequenceEnd = "ChartSequenceEnd", e.ClientUchPosEntity = "ClientUchPosEntity", e.ProtocolInfo = "ProtocolInfo", e.ClientMessageEntity = "ClientMessageEntity", e.ArchiveRequestEntity = "ArchiveRequestEntity", e.AuthenticationRequestEntity = "AuthenticationRequestEntity", e.AuthorizeWithConnectionKeyEntity = "AuthorizeWithConnectionKeyEntity", e.ClientOrderEntity = "ClientOrderEntity", e.DataFlowSubscribeEntity = "DataFlowSubscribeEntity", e.DisconnectEntity = "DisconnectEntity", e.EnrollCertificateEntity = "EnrollCertificateEntity", e.HeartbeatEntity = "HeartbeatEntity", e.UpdateCertificateEntity = "UpdateCertificateEntity", e.AllowedDiscountTypeEntity = "AllowedDiscountTypeEntity", e.AllowedOrderParamEntity = "AllowedOrderParamEntity", e.AllowedPenaltyTypeEntity = "AllowedPenaltyTypeEntity", e.AllowedPriceControlTypeEntity = "AllowedPriceControlTypeEntity", e.AllowedSettleCodeEntity = "AllowedSettleCodeEntity", e.AllowOrderStatusEntity = "AllowOrderStatusEntity", e.AllTradeExEntity = "AllTradeExEntity", e.ChartArchiveEntity = "ChartArchiveEntity", e.ClientCertificateEntity = "ClientCertificateEntity", e.ClientGTSubAccountEntity = "ClientGTSubAccountEntity", e.ClientOperationEntity = "ClientOperationEntity", e.ClientObjectBalanceIdFIEntity = "ClientObjectBalanceIdFIEntity", e.ClientPositionEntity = "ClientPositionEntity", e.ClientRestrictionsEntity = "ClientRestrictionsEntity", e.ClientSubAccountEntity = "ClientSubAccountEntity", e.ContragentEntity = "ContragentEntity", e.CurrencyMarketBoardEntity = "CurrencyMarketBoardEntity", e.ExchangeEntity = "ExchangeEntity", e.FinInfoExEntity = "FinInfoExEntity", e.FinInfoExtExEntity = "FinInfoExtExEntity", e.FinInstrumentEntity = "FinInstrumentEntity", e.InitFinishedEntity = "InitFinishedEntity", e.LimitsOverflowEntity = "LimitsOverflowEntity", e.MarketBoardEntity = "MarketBoardEntity", e.MarketEntity = "MarketEntity", e.MetricEntity = "MetricEntity", e.TopVolumeInstrumetsRequestFilter = "TopVolumeInstrumetsRequestFilter", e.TopVolumeInstrumetsRequestEntity = "TopVolumeInstrumetsRequestEntity", e.TopVolumeInstrumetsResponseEntity = "TopVolumeInstrumetsResponseEntity", e.NewsEntity = "NewsEntity", e.ObjectEntity = "ObjectEntity", e.ObjectGroupEntity = "ObjectGroupEntity", e.ObjectTypeEntity = "ObjectTypeEntity", e.OrderBookExEntity = "OrderBookExEntity", e.OrderBookExLevelEntity = "OrderBookExLevelEntity", e.OrderExEntity = "OrderExEntity", e.WithdrawMoneyOrder = "WithdrawMoneyOrder", e.BankEntity = "BankEntity", e.SettleCodeEntity = "SettleCodeEntity", e.SubAccountRazdelEntity = "SubAccountRazdelEntity", e.ClientGetTradingLimitsReq = "ClientGetTradingLimitsReq", e.ClientGetTradingLimitsRsp = "ClientGetTradingLimitsRsp", e.TradePeriodStatusEntity = "TradePeriodStatusEntity", e.TSAccount4LSEntity = "TSAccount4LSEntity", e.UserCredentialsEntity = "UserCredentialsEntity", e.IntervalInfoEntity = "IntervalInfoEntity", e.ResponseForCertificateActionSMSEntity = "ResponseForCertificateActionSMSEntity", e.ResponseForCertificateActionWithSMSEntity = "ResponseForCertificateActionWithSMSEntity", e.OhlcvDataPointEntity = "OhlcvDataPointEntity", e.OhlcvDataPointFractionalEntity = "OhlcvDataPointFractionalEntity", e.ClientSubAccPositionEntity = "ClientSubAccPositionEntity", e.BaseOperationEntity = "BaseOperationEntity", e.ClientAccountEntity = "ClientAccountEntity", e.ProtocolInfoEntity = "ProtocolInfoEntity", e.CertificateRequestEntity = "CertificateRequestEntity", e.CertificateResponseEntity = "CertificateResponseEntity", e.RequestForCertificateActionSMSEntity = "RequestForCertificateActionSMSEntity", e.CandleStandardDbEntity = "CandleStandardDbEntity", e.RequestForCertificateActionWithSMSEntity = "RequestForCertificateActionWithSMSEntity", e.ArchiveRequest3Entity = "ArchiveRequest3Entity", e.PassportAuthenticationRequestEntity = "PassportAuthenticationRequestEntity", e.BrokerRecommendationEntity = "BrokerRecommendationEntity", e.ChatMessageEntity = "ChatMessageEntity", e.ChatGroupEntity = "ChatGroupEntity", e.ObjectExtEntity = "ObjectExtEntity", e.MpvDataPointEntity = "MpvDataPointEntity", e.MpvDataPointFractionalEntity = "MpvDataPointFractionalEntity", e.ResetDataRequestEntity = "ResetDataRequestEntity", e.TrackPriceEntity = "TrackPriceEntity", e.NotificationSubscriptionEntity = "NotificationSubscriptionEntity", e.NotificationSubscriptionStateEntity = "NotificationSubscriptionStateEntity", e.TradeShortNoticeRequest = "TradeShortNoticeRequest", e.TradeShortNoticeObject = "TradeShortNoticeObject", e.TradeShortNoticeResponse = "TradeShortNoticeResponse", e.ClientMoneyAccountEntity = "ClientMoneyAccountEntity", e.ClientGetMarketOrderValueReq = "ClientGetMarketOrderValueReq", e.ClientGetMarketOrderValueRsp = "ClientGetMarketOrderValueRsp", e.WithdrawPartnerAssetOrder = "WithdrawPartnerAssetOrder", e.ClientGetInstrumentInfoExtReq = "ClientGetInstrumentInfoExtReq", e.ClientGetInstrumentInfoExtRsp = "ClientGetInstrumentInfoExtRsp", e.ClientGetInstrumentInfoByUniversalCodesExtReq = "ClientGetInstrumentInfoByUniversalCodesExtReq", e.ClientGetInstrumentInfoByUniversalCodesExtRsp = "ClientGetInstrumentInfoByUniversalCodesExtRsp", e.InstrumentInfoExtEntity = "InstrumentInfoExtEntity", e.UniversalCodesInfo = "UniversalCodesInfo", e;
}({});
//#endregion
//#region packages/core/src/lib/services/debugTools/feTable/entityPicker.ts
function t(t, n, r) {
	let i = Object.values(e).sort(), a = [], o = -1, s = () => {
		n.hidden = !0, t.setAttribute("aria-expanded", "false"), t.removeAttribute("aria-activedescendant"), r.setAttribute("aria-expanded", "false");
	}, c = (e) => {
		t.value = e, s();
	}, l = () => {
		for (let [e, t] of [...n.children].entries()) t.setAttribute("aria-selected", String(e === o));
		o >= 0 ? (t.setAttribute("aria-activedescendant", `fe-entity-${o}`), n.children[o]?.scrollIntoView({ block: "nearest" })) : t.removeAttribute("aria-activedescendant");
	}, u = () => {
		let e = t.value.trim().toLocaleLowerCase();
		a = i.filter((t) => t.toLocaleLowerCase().includes(e)).slice(0, 50), o = -1, n.replaceChildren();
		for (let [e, r] of a.entries()) {
			let i = t.ownerDocument.createElement("div");
			i.id = `fe-entity-${e}`, i.setAttribute("role", "option"), i.setAttribute("aria-selected", "false"), i.textContent = r, i.title = r, i.addEventListener("click", () => c(r)), n.append(i);
		}
		if (!a.length) {
			let e = t.ownerDocument.createElement("div");
			e.className = "empty", e.textContent = "Совпадений нет — можно ввести своё имя", n.append(e);
		}
		n.hidden = !1, t.setAttribute("aria-expanded", "true"), r.setAttribute("aria-expanded", "true"), t.removeAttribute("aria-activedescendant");
	};
	t.addEventListener("input", u), t.addEventListener("focus", u), t.addEventListener("blur", s), n.addEventListener("pointerdown", (e) => e.preventDefault()), r.addEventListener("pointerdown", (e) => e.preventDefault()), r.addEventListener("click", () => {
		let e = !n.hidden;
		t.focus(), e ? s() : u();
	}), t.addEventListener("keydown", (e) => {
		e.key === "ArrowDown" || e.key === "ArrowUp" ? (e.preventDefault(), n.hidden && u(), a.length && (o = o < 0 ? e.key === "ArrowDown" ? 0 : a.length - 1 : (o + (e.key === "ArrowDown" ? 1 : a.length - 1)) % a.length, l())) : e.key === "Enter" && !n.hidden && o >= 0 ? (e.preventDefault(), c(a[o])) : e.key === "Escape" && !n.hidden ? (e.preventDefault(), e.stopPropagation(), s()) : e.key === "Tab" && s();
	});
}
//#endregion
//#region packages/core/src/lib/services/debugTools/feTable/types.ts
var n = 2147483648, r = () => ({
	field: "",
	operator: "contains",
	value: ""
}), i = class {
	host;
	recorder;
	row;
	query = 0;
	copyQuery = 0;
	reads = Promise.resolve();
	paths = /* @__PURE__ */ new WeakMap();
	crumbs = [];
	cursors = [void 0];
	pageIndex = 0;
	page;
	raw = !1;
	textOffset = 0;
	textLength = 0;
	constructor(e, t) {
		this.host = e, this.recorder = t, e.classList.add("jsonViewer"), e.innerHTML = "\n      <div id=\"selected\"></div>\n      <div class=\"jsonControls\"><button type=\"button\" data-action=\"tree\" title=\"Показать раскрываемые поля и диапазоны массива\">Структура</button><button type=\"button\" data-action=\"raw\" title=\"Показать текущий узел текстом, порциями до 65 536 символов\">Исходный JSON</button><button type=\"button\" data-action=\"copy\">Копировать JSON узла</button><button type=\"button\" data-action=\"reset\" title=\"Показать все поля и элементы текущего узла; фильтры списка сообщений сохранятся\" hidden>Показать всё</button></div>\n      <nav class=\"jsonPath\" aria-label=\"Путь JSON\"></nav>\n      <details class=\"jsonFilter\"><summary title=\"Поиск внутри выбранного узла без изменения фильтров списка сообщений\">Поиск в узле</summary><form class=\"jsonSearch\" aria-label=\"Поиск внутри сообщения\">\n        <label>Поле <input name=\"jsonField\" placeholder=\"Имя / вложенный.путь\" title=\"Поиск среди дочерних узлов; внутри массива путь задаётся относительно его элемента. Пустое поле — все значения\"></label>\n        <select name=\"jsonOperator\" aria-label=\"Операция внутри сообщения\"><option value=\"contains\">содержит</option><option value=\"equals\">равно</option><option value=\"exists\">существует</option></select>\n        <label>Значение <input name=\"jsonValue\" title=\"Искомое значение внутри дочернего узла или элемента массива\"></label><button type=\"submit\" title=\"Искать только внутри текущего узла выбранного сообщения\">Найти в узле</button><button type=\"button\" data-action=\"reset\" title=\"Убрать фильтр внутри текущего узла\">Сбросить</button>\n      </form></details>\n      <div class=\"jsonStatus\" role=\"status\"></div>\n      <div class=\"jsonContent\"></div>\n      <div class=\"jsonControls jsonPager\"><button type=\"button\" data-action=\"prev\" title=\"Предыдущая порция результатов или текста JSON\">Назад по узлу</button><button type=\"button\" data-action=\"next\" title=\"Следующая порция результатов или текста JSON\">Далее по узлу</button></div>", e.addEventListener("click", this.onClick), e.addEventListener("submit", this.onSubmit), e.hidden = !0;
	}
	element(e) {
		let t = this.host.querySelector(e);
		if (!t) throw Error(`Не найден элемент ${e}`);
		return t;
	}
	get current() {
		return this.crumbs[this.crumbs.length - 1];
	}
	highlight(e, t) {
		let n = this.current.filter, r = n.field.replace(/\[\]/g, "").split(".").pop() || "", i = n.operator === "exists" ? r : n.value || r, a = i ? t.split(RegExp(`(${i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")) : [t];
		e.replaceChildren();
		for (let [t, n] of a.entries()) if (t % 2) {
			let t = e.ownerDocument.createElement("mark");
			t.textContent = n, e.append(t);
		} else e.append(e.ownerDocument.createTextNode(n));
	}
	button(e, t) {
		let n = document.createElement("button");
		return n.type = "button", n.textContent = e, n.dataset.action = t, n;
	}
	nodeButton(e, t = e.preview) {
		let n = this.button(t, "open");
		return n.dataset.offset = String(e.offset), n.dataset.label = t, n.title = `${e.type} · ${e.length} символов JSON. Открыть этот узел`, n;
	}
	onSubmit = (e) => {
		e.preventDefault();
		let t = this.element("[name=jsonOperator]").value;
		this.current.filter = {
			field: this.element("[name=jsonField]").value.trim(),
			value: this.element("[name=jsonValue]").value,
			operator: t === "equals" || t === "exists" ? t : "contains"
		}, this.resetPage(), this.raw = !1, this.load();
	};
	onClick = (e) => {
		let t = e.target.closest("button");
		if (!t || t.disabled || !this.row) return;
		let n = t.dataset.action;
		if (n === "copy" || n === "copy-object") {
			e.preventDefault();
			let r = ++this.copyQuery, i = this.query, a = n === "copy-object", o = a ? Number(t.dataset.offset) : this.current.offset, s = !a && this.raw ? this.textOffset : 0;
			this.reads = this.reads.then(() => this.copy(i, r, o, s, a));
			return;
		}
		if (n === "open") {
			let e = this.paths.get(t);
			e ? this.crumbs = e : this.crumbs.push({
				offset: Number(t.dataset.offset),
				label: t.dataset.label ?? "",
				filter: r()
			}), this.raw = !1, this.resetPage();
		} else if (n === "crumb") this.crumbs.length = Number(t.dataset.index) + 1, this.resetPage();
		else if (n === "reset") this.current.filter = r(), this.raw = !1, this.resetPage();
		else if (n === "raw" || n === "tree") this.raw = n === "raw", this.textOffset = 0;
		else if (n === "prev") this.raw ? this.textOffset = Math.max(0, this.textOffset - 65536) : this.pageIndex--;
		else if (n === "next") this.raw ? this.textOffset += 65536 : this.cursors[++this.pageIndex] = this.page?.next;
		else return;
		this.load();
	};
	resetPage() {
		this.pageIndex = 0, this.cursors = [void 0], this.textOffset = 0;
	}
	async show(e, t = r()) {
		this.row = e, this.crumbs = [{
			offset: 0,
			label: "$",
			filter: {
				field: t.field,
				operator: t.operator,
				value: t.value
			}
		}], this.raw = !1, this.resetPage(), this.host.hidden = !1, this.element("#selected").textContent = `${e.entity} · ${e.source} · connection ${e.connectionId} · #${e.seq}`, await this.load();
	}
	clear() {
		this.query++, this.row = void 0, this.page = void 0, this.crumbs = [], this.element(".jsonContent").replaceChildren(), this.host.hidden = !0, this.recorder.rpc({ method: "inspect-clear" }).catch(() => void 0);
	}
	destroy() {
		this.clear(), this.host.removeEventListener("click", this.onClick), this.host.removeEventListener("submit", this.onSubmit);
	}
	async load() {
		let e = this.row;
		if (!e) return;
		let t = ++this.query, n = this.current, r = this.element(".jsonStatus"), i = this.element(".jsonContent"), a = this.element("[data-action=prev]"), o = this.element("[data-action=next]");
		i.setAttribute("aria-busy", "true"), this.element(".jsonPager").hidden = !0, a.disabled = !0, o.disabled = !0, this.element("[data-action=copy]").disabled = !0, i.replaceChildren(), this.paths = /* @__PURE__ */ new WeakMap(), i.classList.toggle("jsonTree", !this.raw), r.textContent = "Поиск внутри сообщения…", r.classList.remove("error"), this.element(".jsonFilter").hidden = this.raw, this.element(".jsonControls [data-action=reset]").hidden = !n.filter.field && !n.filter.value, this.element(".jsonFilter > summary").textContent = n.filter.field || n.filter.value ? "Поиск в узле · фильтр применён" : "Поиск в узле", this.element("[name=jsonField]").value = n.filter.field, this.element("[name=jsonValue]").value = n.filter.value, this.element("[name=jsonOperator]").value = n.filter.operator, this.element(".jsonPath").replaceChildren(...this.crumbs.map((e, t) => {
			let n = this.button(e.label, "crumb");
			return n.dataset.index = String(t), n.title = "Перейти к этому уровню JSON", n;
		}));
		try {
			if (this.raw) {
				let s = await this.recorder.rpc({
					method: "inspect-text",
					sessionId: e.sessionId,
					seq: e.seq,
					offset: n.offset,
					from: this.textOffset
				});
				if (t !== this.query) return;
				this.textLength = s.length;
				let c = document.createElement("pre");
				this.highlight(c, s.text), i.append(c), r.textContent = `JSON: символы ${this.textOffset + 1}–${this.textOffset + s.text.length} из ${s.length}`, a.disabled = this.textOffset === 0, o.disabled = this.textOffset + s.text.length >= s.length, this.element(".jsonPager").hidden = a.disabled && o.disabled;
			} else {
				let s, c = [], l = this.cursors[this.pageIndex], u = 0;
				do {
					if (s = await this.recorder.rpc({
						method: "inspect",
						sessionId: e.sessionId,
						seq: e.seq,
						offset: n.offset,
						after: l,
						filter: n.filter,
						describeArrays: !0,
						limit: 100 - c.length
					}), t !== this.query) return;
					u += s.scanned, c.push(...s.entries.map((e) => ({
						...e,
						preview: this.entryPreview(e, s.columns),
						cells: []
					}))), l = s.next, r.textContent = `Поиск внутри сообщения… просмотрено ${u}`;
				} while (c.length < 100 && s.next);
				if (s = {
					...s,
					entries: c,
					columns: [],
					scanned: u
				}, c.length === 100 && s.next) {
					let i = s.next;
					for (; i;) {
						let a = await this.recorder.rpc({
							method: "inspect",
							sessionId: e.sessionId,
							seq: e.seq,
							offset: n.offset,
							after: i,
							filter: n.filter,
							limit: 1,
							probe: !0
						});
						if (t !== this.query) return;
						if (u += a.scanned, s.next = a.next, r.textContent = `Поиск внутри сообщения… просмотрено ${u}`, a.matched) break;
						i = a.next;
					}
				}
				if (this.page = s, this.textLength = s.node.length, await this.render(s, () => t === this.query), t !== this.query) return;
				let d = !!(n.filter.field || n.filter.value);
				if (d) {
					let e = i.querySelector(":scope > .jsonEntry");
					e instanceof HTMLDetailsElement && (e.open = !0);
				}
				r.textContent = d ? `Показано совпадений: ${s.entries.length}` : "", this.element(".jsonFilter").hidden = s.node.type !== "object" && s.node.type !== "array", a.disabled = this.pageIndex === 0, o.disabled = !s.next, this.element(".jsonPager").hidden = a.disabled && o.disabled;
			}
			let s = this.element("[data-action=copy]");
			s.disabled = !1, s.textContent = this.textLength > 65536 ? "Копировать фрагмент JSON" : "Копировать JSON узла", s.title = "До 65 536 символов. Для полного большого сообщения доступен экспорт сеанса";
		} catch (e) {
			t === this.query && (r.textContent = String(e), r.classList.add("error"));
		} finally {
			t === this.query && i.setAttribute("aria-busy", "false");
		}
	}
	async render(e, t) {
		let n = this.element(".jsonContent");
		if (e.node.type !== "array" && e.node.type !== "object") {
			let t = document.createElement("pre");
			this.highlight(t, e.node.preview), n.append(t);
			return;
		}
		if (n.classList.add("jsonTree"), e.node.type === "array" && !this.current.filter.field && !this.current.filter.value) await this.renderArray(n, e.node, this.crumbs, t);
		else {
			this.renderNodes(n, e, this.crumbs);
			let r = this.current.offset === 0 ? e.entries.find((e) => e.key === "data" && e.type === "array") : void 0, i = r && n.querySelector(`.jsonValue[data-offset="${r.offset}"]`);
			if (r && i) {
				let e = this.reads.then(async () => {
					await this.describeArray(r, t) && t() && (i.textContent = r.preview, i.title = r.preview);
				});
				this.reads = e.catch(() => void 0), await e;
			}
		}
	}
	async describeArray(e, t, n = 0, r, i) {
		let a = this.row;
		if (!a || !t()) return;
		let o;
		do {
			if (o = await this.recorder.rpc({
				method: "inspect-array",
				sessionId: a.sessionId,
				seq: a.seq,
				offset: e.offset,
				from: n,
				to: r
			}), !t()) return;
			i?.(o.count);
		} while (!o.complete);
		return e.count = o.count, e.preview = `Array(${o.count})`, o;
	}
	async renderArray(e, t, n, r, i = 0, a, o = !0) {
		let s = await this.describeArray(t, r, i, a, (t) => {
			e.textContent = `Подсчёт элементов массива… ${t}`;
		});
		if (s) {
			if (e.replaceChildren(), o) {
				let t = document.createElement("div");
				t.className = "muted", t.textContent = s.count > 100 ? `Array(${s.count}) · ${Math.ceil(s.count / 100)} сегментов по 100 элементов` : `Array(${s.count})`, e.append(t);
			}
			if (s.count) {
				if (s.count <= 100 && i === 0 && a === void 0) {
					let i = document.createElement("div");
					e.append(i), await this.renderSegment(i, t, s.segments[0], n, r);
					return;
				}
				for (let i of s.segments) {
					let a = document.createElement("details"), o = document.createElement("summary"), s = document.createElement("div"), c = this.query, l = 0;
					a.className = "jsonBranch jsonRange", o.className = "jsonSummary", o.textContent = `[${i.from} … ${i.to}]`, o.title = `${i.to - i.from + 1} элементов. Загрузить только этот диапазон`, s.className = "jsonChildren", a.append(o, s), a.ontoggle = () => {
						let e = ++l;
						if (s.replaceChildren(), a.open && a.isConnected && c === this.query) {
							this.collapseSiblings(a);
							let o = () => r() && c === this.query && e === l && a.open && a.isConnected;
							this.reads = this.reads.then(async () => {
								if (o()) try {
									i.to - i.from < 100 ? await this.renderSegment(s, t, i, n, o) : await this.renderArray(s, t, n, o, i.from, i.to, !1);
								} catch (e) {
									o() && (s.textContent = String(e));
								}
							});
						}
					}, e.append(a);
				}
			}
		}
	}
	async renderSegment(e, t, n, i, a) {
		let o = this.row;
		if (!o || !a()) return;
		if (this.element(".jsonContent").querySelectorAll(".jsonEntry").length > 200) {
			this.expansionLimit(e, t, i);
			return;
		}
		let s = [], c = n.cursor;
		do {
			e.textContent = `Загрузка [${n.from} … ${n.to}]…`;
			let i = await this.recorder.rpc({
				method: "inspect",
				sessionId: o.sessionId,
				seq: o.seq,
				offset: t.offset,
				after: c,
				through: n.to,
				filter: r()
			});
			if (!a()) return;
			s.push(i), c = i.next;
		} while (c);
		e.replaceChildren();
		for (let t of s) this.renderNodes(e, t, i);
	}
	collapseSiblings(e) {
		for (let t of e.parentElement?.children ?? []) t instanceof HTMLDetailsElement && t !== e && (t.open = !1, t.querySelector(":scope > .jsonChildren")?.replaceChildren());
	}
	renderNodes(e, t, n) {
		if (this.element(".jsonContent").querySelectorAll(".jsonEntry").length + t.entries.length > 300) {
			this.expansionLimit(e, t.node, n);
			return;
		}
		for (let i of t.entries) {
			let a = (i.type === "object" || i.type === "array") && i.length > 2, o = document.createElement(a ? "details" : "div"), s = document.createElement(a ? "summary" : "div"), c = document.createElement("span"), l = document.createElement("span"), u = [...n, {
				offset: i.offset,
				label: i.key || "\"\"",
				filter: r()
			}], d = this.entryPreview(i, t.columns);
			if (o.className = a ? "jsonEntry jsonBranch" : "jsonEntry", s.className = a ? "jsonSummary" : "jsonLeaf", c.className = "jsonName", c.title = i.key || "\"\"", this.highlight(c, `${t.node.type === "array" ? i.key.slice(1, -1) : i.key || "\"\""}: `), l.className = "jsonValue", l.dataset.type = i.type, i.type === "array" && (l.dataset.offset = String(i.offset)), this.highlight(l, d.slice(0, 320)), l.title = d.slice(0, 640), s.append(c, l), a) {
				let e = this.nodeButton(i, "↗");
				e.className = "jsonJump", e.dataset.label = i.key || "\"\"", e.setAttribute("aria-label", `Открыть ${i.key || "\"\""} отдельно`), e.title = "Открыть этот узел отдельно: поиск, JSON и копирование", this.paths.set(e, u), s.append(e);
			}
			if ((t.node.type === "array" || i.arrayOffset !== void 0) && i.type === "object") {
				let e = this.button("⧉", "copy-object");
				e.className = "jsonJump", e.dataset.offset = String(i.offset), e.title = `Копировать JSON объекта ${i.key} целиком`, e.setAttribute("aria-label", e.title), s.append(e);
			}
			o.append(s), e.append(o), o instanceof HTMLDetailsElement && this.setupBranch(o, i, u);
		}
	}
	entryPreview(e, t) {
		return e.length === 2 && (e.type === "object" || e.type === "array") ? e.type === "object" ? "{}" : "[]" : e.type === "object" && e.cells.length ? `{${e.cells.slice(0, 4).map((e) => `${t[e.column]}: ${e.node.preview}`).join(", ")}${e.cells.length > 4 ? ", …" : ""}}`.slice(0, 320) : e.preview;
	}
	expansionLimit(e, t, n) {
		let r = document.createElement("div"), i = this.nodeButton(t, "Открыть этот узел отдельно");
		this.paths.set(i, n), r.className = "muted", r.textContent = "Достигнут лимит раскрытого дерева. Сверните другие ветки или откройте узел отдельно", e.replaceChildren(r, i);
	}
	setupBranch(e, t, n) {
		let i = document.createElement("div"), a = this.query, o = this.row, s = 0;
		i.className = "jsonChildren", e.append(i), e.ontoggle = () => {
			let c = ++s;
			if (i.replaceChildren(), !e.open || !o) return;
			this.collapseSiblings(e);
			let l = () => a === this.query && c === s && e.open && e.isConnected, u = async (a) => {
				if (l()) {
					if (i.replaceChildren(), this.element(".jsonContent").querySelectorAll(".jsonEntry").length > 200) {
						this.expansionLimit(i, t, n);
						return;
					}
					i.textContent = "Загрузка полей…";
					try {
						let s = await this.recorder.rpc({
							method: "inspect",
							sessionId: o.sessionId,
							seq: o.seq,
							offset: t.offset,
							after: a,
							filter: r(),
							describeArrays: !0
						});
						if (!l()) return;
						if (i.replaceChildren(), s.node.type === "array") {
							if (await this.renderArray(i, s.node, n, l), l() && s.node.count !== void 0) {
								let t = e.querySelector(":scope > summary > .jsonValue");
								t && (t.textContent = `Array(${s.node.count})`);
							}
							return;
						}
						if (this.renderNodes(i, s, n), s.entries.length || (i.textContent = t.type === "array" ? "[]" : "{}"), s.next) {
							let e = this.button("Следующая порция полей", "branch-next");
							e.title = "Заменить эту порцию следующей, не накапливая элементы", e.onclick = () => {
								this.reads = this.reads.then(() => u(s.next));
							}, i.append(e);
						}
					} catch (e) {
						l() && (i.textContent = String(e));
					}
				}
			};
			this.reads = this.reads.then(() => u());
		};
	}
	async copy(e, t, n, r, i) {
		let a = this.row;
		if (!(!a || e !== this.query || t !== this.copyQuery)) try {
			let o = [];
			for (;;) {
				let s = await this.recorder.rpc({
					method: "inspect-text",
					sessionId: a.sessionId,
					seq: a.seq,
					offset: n,
					from: r
				});
				if (e !== this.query || t !== this.copyQuery) return;
				if (o.push(s.text), r += s.text.length, !i || r >= s.length) break;
				if (!s.text.length) throw Error("Не удалось прочитать JSON объекта целиком");
				this.element(".jsonStatus").textContent = `Копирование JSON объекта… ${r} / ${s.length}`;
			}
			if (e === this.query && t === this.copyQuery) {
				let n = this.host.ownerDocument.defaultView;
				if (!n) throw Error("Окно просмотрщика закрыто");
				this.recorder.copy ? await this.recorder.copy(o.join("")) : await n.navigator.clipboard.writeText(o.join("")), e === this.query && t === this.copyQuery && (this.element(".jsonStatus").textContent = i ? "JSON объекта скопирован" : "JSON скопирован");
			}
		} catch (n) {
			e === this.query && t === this.copyQuery && (this.element(".jsonStatus").textContent = String(n));
		}
	}
}, a = ":host {\n  --fe-bg: #fff;\n  --fe-text: #253247;\n  --fe-surface: #f6f8fb;\n  --fe-border: #c8d1df;\n  --fe-divider: #e2e7ef;\n  --fe-muted: #62718a;\n  --fe-disabled-text: #8792a3;\n  --fe-disabled-bg: #f1f3f7;\n  --fe-hover: #eaf0f9;\n  --fe-hover-border: #8299ba;\n  --fe-accent: #295da8;\n  --fe-accent-hover: #204d90;\n  --fe-on-accent: #fff;\n  --fe-danger: #a42c35;\n  --fe-key: #7944ad;\n  --fe-string: #a23639;\n  --fe-scalar: #2455a4;\n  --fe-selected: #e6effc;\n  --fe-selected-text: #17477f;\n  --fe-head: #f1f4f8;\n  --fe-row-hover: #f2f6fc;\n  --fe-mark: #ffeb99;\n  --fe-shadow: #182b4a33;\n  --fe-overlay-shadow: #182b4a26;\n  --fe-radius: 10px;\n  --fe-space: 10px;\n  --fe-padding: 6px;\n  --fe-square: 0;\n\n  all: initial;\n  font: 13px / 1.45 system-ui, sans-serif;\n  color: var(--fe-text);\n  color-scheme: light;\n}\n\n:host([data-theme='dark']) {\n  --fe-bg: #202124;\n  --fe-text: #e3e3e3;\n  --fe-surface: #292a2d;\n  --fe-border: #5f6368;\n  --fe-divider: #3c4043;\n  --fe-muted: #9aa0a6;\n  --fe-disabled-text: #80868b;\n  --fe-disabled-bg: #292a2d;\n  --fe-hover: #35363a;\n  --fe-hover-border: #8ab4f8;\n  --fe-accent: #8ab4f8;\n  --fe-accent-hover: #aecbfa;\n  --fe-on-accent: #202124;\n  --fe-danger: #f28b82;\n  --fe-key: #c58af9;\n  --fe-string: #f28b82;\n  --fe-scalar: #8ab4f8;\n  --fe-selected: #314463;\n  --fe-selected-text: #d2e3fc;\n  --fe-head: #292a2d;\n  --fe-row-hover: #303134;\n  --fe-mark: #66551a;\n  --fe-shadow: #0006;\n  --fe-overlay-shadow: #0006;\n\n  color-scheme: dark;\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: border-box;\n}\n\n[hidden] {\n  display: none;\n}\n\n:focus-visible {\n  outline: 2px solid #3978cf;\n  outline-offset: 2px;\n}\n\n.panel {\n  resize: both;\n\n  position: fixed;\n  z-index: 2147483647;\n  right: 16px;\n  bottom: 16px;\n\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n\n  width: min(1120px, calc(100vw - 32px));\n  min-width: min(420px, calc(100vw - 32px));\n  height: min(740px, calc(100vh - 32px));\n  min-height: 300px;\n\n  color: var(--fe-text);\n\n  background: var(--fe-bg);\n  border: 1px solid var(--fe-border);\n  border-radius: var(--fe-radius);\n  box-shadow: 0 12px 48px var(--fe-shadow);\n}\n\n.pip {\n  resize: none;\n\n  position: static;\n\n  width: 100vw;\n  min-width: 0;\n  height: 100vh;\n  min-height: 0;\n\n  border: 0;\n  border-radius: var(--fe-square);\n}\n\n.embedded {\n  resize: none;\n\n  position: static;\n\n  width: 100%;\n  min-width: 0;\n  height: 100vh;\n  min-height: 0;\n\n  border: 0;\n  border-radius: var(--fe-square);\n  box-shadow: none;\n}\n\n@media (width <= 760px) {\n  .embedded .body {\n    grid-template-columns: minmax(0, 1fr);\n    grid-template-rows: minmax(100px, 0.6fr) minmax(0, 1fr);\n  }\n}\n\nheader,\nfooter,\nform {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n  align-items: center;\n\n  padding: 12px;\n\n  border-bottom: 1px solid var(--fe-divider);\n}\n\nheader,\nfooter {\n  background: var(--fe-surface);\n}\n\nheader strong {\n  margin-right: auto;\n  white-space: nowrap;\n}\n\n.recordingControls {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n\nform {\n  align-items: end;\n}\n\nbutton,\ninput,\nselect,\nsummary {\n  max-width: 100%;\n  min-height: 32px;\n  padding: var(--fe-padding) 9px;\n\n  font: inherit;\n  color: inherit;\n\n  background: var(--fe-bg);\n  border: 1px solid var(--fe-border);\n  border-radius: 5px;\n}\n\nbutton,\nsummary {\n  cursor: pointer;\n}\n\nbutton:disabled {\n  cursor: default;\n  color: var(--fe-disabled-text);\n  background: var(--fe-disabled-bg);\n}\n\n.jsonContent button {\n  max-width: 220px;\n  text-align: left;\n  overflow-wrap: anywhere;\n}\n\n.jsonTree {\n  font: 12px / 1.6 ui-monospace, monospace;\n}\n\n.jsonChildren {\n  padding-left: 16px;\n}\n\n.jsonSummary,\n.jsonLeaf {\n  display: flex;\n  gap: 4px;\n  align-items: baseline;\n\n  min-height: 24px;\n  padding: 2px 4px;\n\n  white-space: nowrap;\n\n  background: transparent;\n  border: 0;\n  border-radius: var(--border-radius-0);\n}\n\n.jsonSummary::before {\n  content: '▸';\n  flex: none;\n  width: 10px;\n  color: var(--fe-muted);\n}\n\n.jsonBranch[open] > .jsonSummary::before {\n  content: '▾';\n}\n\n.jsonLeaf {\n  padding-left: 18px;\n}\n\n.jsonName {\n  overflow: hidden;\n  flex: none;\n\n  max-width: 40%;\n\n  color: var(--fe-key);\n  text-overflow: ellipsis;\n}\n\n.jsonValue {\n  overflow: hidden;\n  flex: 1;\n  min-width: 0;\n  text-overflow: ellipsis;\n}\n\n.jsonValue[data-type='string'] {\n  color: var(--fe-string);\n}\n\n.jsonValue[data-type='number'],\n.jsonValue[data-type='boolean'] {\n  color: var(--fe-scalar);\n}\n\n.jsonJump {\n  flex: none;\n\n  min-height: 20px;\n  padding: 0 4px;\n\n  white-space: nowrap;\n\n  background: transparent;\n  border: 0;\n}\n\nbutton:hover:not(:disabled),\nsummary:hover {\n  background: var(--fe-hover);\n  border-color: var(--fe-hover-border);\n}\n\n#record,\nbutton[type='submit'] {\n  color: var(--fe-on-accent);\n  background: var(--fe-accent);\n  border-color: var(--fe-accent);\n}\n\n#record:hover:not(:disabled),\nbutton[type='submit']:hover {\n  background: var(--fe-accent-hover);\n}\n\n.danger {\n  color: var(--fe-danger);\n}\n\ninput {\n  width: 145px;\n}\n\ninput[name='fe'] {\n  width: 70px;\n}\n\ninput[type='datetime-local'] {\n  width: 210px;\n}\n\n.period {\n  position: relative;\n}\n\n.periodFields {\n  position: absolute;\n  z-index: 3;\n  top: calc(100% + 6px);\n  right: 0;\n\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n\n  padding: 12px;\n\n  background: var(--fe-bg);\n  border: 1px solid var(--fe-border);\n  border-radius: 5px;\n  box-shadow: 0 6px 18px var(--fe-overlay-shadow);\n}\n\nlabel,\n.entityPicker {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.entityPicker {\n  position: relative;\n  width: 260px;\n}\n\n.entityControl {\n  display: flex;\n  gap: 4px;\n}\n\n.entityControl input {\n  flex: 1;\n  min-width: 0;\n}\n\n.entityOptions {\n  position: absolute;\n  z-index: 2;\n  top: 100%;\n  left: 0;\n\n  overflow: auto;\n\n  width: max-content;\n  min-width: 100%;\n  max-width: min(480px, 80vw);\n  max-height: 240px;\n\n  background: var(--fe-bg);\n  border: 1px solid var(--fe-border);\n  border-radius: 5px;\n  box-shadow: 0 6px 18px var(--fe-overlay-shadow);\n}\n\n.entityOptions [role='option'],\n.empty {\n  padding: 7px var(--fe-space);\n  overflow-wrap: anywhere;\n}\n\n.entityOptions [role='option'] {\n  cursor: pointer;\n}\n\n.entityOptions [role='option']:hover,\n.entityOptions [aria-selected='true'] {\n  color: var(--fe-selected-text);\n  background: var(--fe-selected);\n}\n\n.body {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  flex: 1;\n  min-height: 0;\n}\n\n.list,\n.detail {\n  overflow: auto;\n  min-width: 0;\n  padding: var(--fe-space);\n}\n\n.list {\n  border-right: 1px solid var(--fe-divider);\n}\n\n.detail {\n  display: flex;\n  flex-direction: column;\n}\n\n:where(.jsonViewer) {\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  min-height: 0;\n}\n\n.jsonControls,\n.jsonPath {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 4px;\n  margin: 8px 0;\n}\n\n.jsonControls[hidden] {\n  display: none;\n}\n\n.jsonSearch {\n  padding: 8px 0;\n}\n\n.jsonContent {\n  overflow: auto;\n  flex: 1;\n  min-height: 60px;\n  max-height: 420px;\n}\n\n.jsonStatus {\n  overflow-wrap: anywhere;\n}\n\ntable {\n  border-collapse: collapse;\n\n  width: 100%;\n  margin-bottom: var(--fe-space);\n\n  font: 12px / 1.5 ui-monospace, monospace;\n  text-align: left;\n}\n\nth {\n  position: sticky;\n  top: -10px;\n  background: var(--fe-head);\n}\n\ntd,\nth {\n  padding: 7px;\n  overflow-wrap: anywhere;\n  border-bottom: 1px solid var(--fe-divider);\n}\n\ntbody tr {\n  cursor: pointer;\n}\n\ntbody tr:hover {\n  background: var(--fe-row-hover);\n}\n\ntr[aria-selected='true'] {\n  background: var(--fe-selected);\n}\n\npre {\n  margin: var(--fe-space) 0;\n  font: 12px / 1.5 ui-monospace, monospace;\n  overflow-wrap: anywhere;\n  white-space: pre-wrap;\n}\n\nmark {\n  color: inherit;\n  background: var(--fe-mark);\n}\n\n.status {\n  flex-basis: 100%;\n  overflow-wrap: anywhere;\n  white-space: pre-wrap;\n}\n\n.error {\n  color: var(--fe-danger);\n}\n\n#progress,\n#selected,\n.muted,\n.empty,\nfooter > span {\n  color: var(--fe-muted);\n}\n\nfooter {\n  border-top: 1px solid var(--fe-divider);\n  border-bottom: 0;\n}\n\n@media (width <= 700px) {\n  .body {\n    overflow: auto;\n    grid-template-columns: 1fr;\n  }\n\n  .list,\n  .detail {\n    overflow: visible;\n  }\n}\n", o = class {
	recorder;
	onDispose;
	container;
	host = document.createElement("div");
	shadow = this.host.attachShadow({ mode: "open" });
	root;
	sessions = [];
	session;
	filter;
	cursors = [void 0];
	next;
	pageIndex = 0;
	query = 0;
	snapshotSeq = 0;
	messageView;
	pip;
	hidden = !1;
	busy = !1;
	exporting = !1;
	destroyed = !1;
	starting = !1;
	clearing = !1;
	reloading = !1;
	constructor(e, n, r) {
		this.recorder = e, this.onDispose = n, this.container = r, this.shadow.innerHTML = `<style>${a}</style>
      <section class="panel" aria-label="Сообщения FE" tabindex="-1">
        <header><strong>FE messages</strong><div class="recordingControls" role="group" aria-label="Управление записью"><button id="record" title="Начать новый сеанс записи входящих и исходящих сообщений FE; вывод DEBUG_FE_MESSAGES в консоль будет отключён">Начать запись</button><button id="reload" title="Сохранить текущую запись, перезагрузить вкладку и один раз включить запись до первого FE-сообщения">Перезагрузить и начать запись</button></div><select id="session" aria-label="Сеанс" title="Выберите сохранённый сеанс записи для просмотра"></select>
          <button id="olderSessions" title="Загрузить предыдущие 100 сеансов">Более ранние сеансы</button><button id="latestSessions" title="Вернуться к последним 100 сеансам записи">Последние сеансы</button><button id="pip" title="Открыть панель в отдельном окне поверх других окон; при его закрытии панель вернётся во вкладку">В отдельное окно</button><button id="close" aria-label="Скрыть панель" title="Скрыть панель. Запись продолжится; открыть панель снова: aDebug.showFETable()">×</button></header>
        <form><label>FE <input name="fe" placeholder="Все" inputmode="numeric" title="Номер FE. Пустое поле — все FE"></label>
          <div class="entityPicker"><label for="fe-entity">Сущность (Entity)</label><div class="entityControl"><input id="fe-entity" name="entity" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="fe-entities" autocomplete="off" placeholder="Все / введите имя" title="Точное имя сущности: выберите подсказку или введите своё. Пустое поле — все сущности"><button id="entityToggle" type="button" aria-label="Показать список сущностей" aria-controls="fe-entities" aria-expanded="false" title="Показать подходящие имена сущностей">▾</button></div><div id="fe-entities" class="entityOptions" role="listbox" aria-label="Сущности" hidden></div></div>
          <label>Направление <select name="direction" title="IN — получено от FE, OUT — отправлено в FE"><option value="">Все</option><option>IN</option><option>OUT</option></select></label>
          <details class="period"><summary title="Фильтр по дате и времени: начало и конец периода">Период</summary><div class="periodFields"><label>С <input name="from" type="datetime-local" step="0.001" title="Начало диапазона включительно, в местном времени. Пустое поле — без ограничения"></label><label>По <input name="to" type="datetime-local" step="0.001" title="Конец диапазона включительно, в местном времени. Пустое поле — без ограничения"></label></div></details>
          <label>Поле <input name="field" placeholder="idFi / data[].idFi" title="Имя поля или путь, например data[].idFi. Без поля поиск выполняется по всем скалярным значениям"></label>
          <select name="operator" aria-label="Операция" title="Содержит — поиск подстроки; равно — точное совпадение; существует — проверка наличия поля без учёта значения"><option value="contains">содержит</option><option value="equals">равно</option><option value="exists">существует</option></select>
          <label>Значение <input name="value" title="Искомое значение. Не учитывается при операции «существует»"></label><button type="submit" title="Применить все фильтры вместе и показать первую страницу результатов">Найти</button><button id="clearSearch" type="button" title="Сбросить все фильтры, включая период, и показать первую страницу текущего сеанса">Очистить поиск</button></form>
        <div class="body"><div class="list"><table><thead><tr><th>Время</th><th>FE</th><th>Напр.</th><th>Entity</th></tr></thead><tbody></tbody></table>
          <button id="prev" title="Предыдущая страница результатов">Назад</button><button id="next" title="Следующая страница: до 100 совпадений после применения фильтров">Далее</button><span id="progress"></span></div>
          <div class="detail"><div id="messageView"></div></div></div>
        <footer><div id="stats" class="status"></div><div id="status" role="status" class="status"></div>
          <button id="refresh" title="Повторить поиск с текущими фильтрами, включая поступившие сообщения, и вернуться на первую страницу">Обновить список</button><span id="newMessages" class="muted" title="Число сохранённых сообщений после последнего поиска, без учёта фильтров"></span><button id="export" title="Сохранить весь выбранный сеанс в JSONL: одно сообщение на строку, без учёта фильтров">Скачать сеанс (JSONL)</button><button id="remove" class="danger" title="Безвозвратно удалить выбранный сеанс из локальной истории; потребуется подтверждение">Удалить сеанс</button><button id="removeAll" class="danger" title="Безвозвратно удалить всю локальную историю FE во всех вкладках. Сначала остановите запись во всех вкладках">Удалить все сеансы</button>
          <span>SharedWorker: соединение принадлежит текущей активной вкладке</span></footer>
      </section>`, this.root = this.element(".panel"), t(this.element("#fe-entity"), this.element("#fe-entities"), this.element("#entityToggle")), this.messageView = new i(this.element("#messageView"), this.recorder), this.recorder.onChange = (e, t) => {
			if (!this.destroyed) {
				if (e) {
					let t = this.sessions.find((t) => t.id === e.id);
					t && Object.assign(t, e), this.session?.id === e.id && (this.session = e);
				}
				t && this.status(t, !0), this.update(), this.hidden && !this.recorder.isRecording && this.run(() => this.dispose());
			}
		}, this.element("form").addEventListener("submit", (e) => {
			e.preventDefault(), this.run(() => this.search());
		}), this.button("olderSessions", () => this.loadSessions(void 0, this.sessions[this.sessions.length - 1]?.id)), this.button("latestSessions", () => this.loadSessions()), this.button("record", () => this.toggleRecording()), this.button("reload", () => this.reloadAndRecord()), this.button("close", async () => this.hide()), this.button("pip", () => this.openPiP()), this.button("refresh", () => this.search()), this.button("clearSearch", async () => {
			this.element("form").reset(), await this.search();
		}), this.button("prev", () => this.loadPage(this.pageIndex - 1)), this.button("next", async () => {
			this.cursors[this.pageIndex + 1] = this.next, await this.loadPage(this.pageIndex + 1);
		}), this.button("export", () => this.export()), this.button("removeAll", () => this.removeAll()), this.button("remove", async () => {
			!this.session || this.recorder.isRecording || this.exporting || this.view.confirm("Удалить выбранный сеанс FE без возможности восстановления?") && (await this.recorder.rpc({
				method: "remove",
				sessionId: this.session.id
			}), await this.loadSessions());
		}), this.element("#session").addEventListener("change", () => this.run(async () => {
			this.session = this.sessions.find((e) => e.id === this.element("#session").value), await this.search();
		})), this.root.addEventListener("keydown", (e) => {
			e.key === "Escape" && (this.hide(), e.stopPropagation());
		}), r ? (this.root.classList.add("embedded"), this.element("#pip").hidden = !0, this.element("#close").title = "Отключиться и остановить запись", r.append(this.host)) : document.body.append(this.host), this.run(() => this.loadSessions(this.recorder.sessionId)), this.reveal();
	}
	get view() {
		return this.host.ownerDocument.defaultView ?? window;
	}
	element(e) {
		let t = this.shadow.querySelector(e);
		if (!t) throw Error(`Не найден элемент ${e}`);
		return t;
	}
	button(e, t) {
		this.element(`#${e}`).addEventListener("click", () => this.run(t));
	}
	run(e) {
		e().catch((e) => this.status(String(e), !0));
	}
	status(e, t = !1) {
		let n = this.element("#status");
		n.textContent = e, n.classList.toggle("error", t);
	}
	update() {
		let e = this.recorder.isRecording || this.starting, t = "Начать запись", r = "○ Просмотр";
		this.starting ? (t = "Подготовка", r = "○ Подготовка") : e && (t = "Остановить запись", r = "● Запись"), this.element("#record").textContent = t, this.element("#record").title = e ? "Остановить сбор сообщений и дождаться сохранения очереди. История останется доступна" : "Начать новый сеанс записи входящих и исходящих сообщений FE; вывод DEBUG_FE_MESSAGES в консоль будет отключён", this.element("#record").disabled = this.starting || this.clearing || this.reloading, this.element("#reload").disabled = this.starting || this.clearing || this.exporting || this.reloading, this.element("#remove").disabled = e || !this.session || this.exporting || this.clearing || this.reloading, this.element("#removeAll").disabled = e || !this.sessions.length || this.exporting || this.clearing || this.reloading, this.element("#export").disabled = !this.session || this.exporting || this.clearing || this.reloading;
		let i = this.session;
		this.element("#newMessages").textContent = `Новых сообщений: ${Math.max(0, (i?.count ?? 0) - this.snapshotSeq)}`, this.element("#stats").textContent = i ? `${r} · Сохранено: ${i.count} · Данные сеанса: ${(i.bytes / 1048576).toFixed(2)} MiB · Лимит всей истории: ${n / 1048576} MiB` : "Выберите сеанс или начните запись";
	}
	async loadSessions(e = this.session?.id, t) {
		this.sessions = await this.recorder.rpc({
			method: "sessions",
			before: t
		}), this.element("#olderSessions").disabled = this.sessions.length < 100, this.session = this.sessions.find((t) => t.id === e) ?? this.sessions[0];
		let n = this.element("#session");
		n.replaceChildren();
		for (let e of this.sessions) {
			let t = document.createElement("option");
			t.value = e.id, t.textContent = new Date(e.startedAt).toLocaleString(), n.append(t);
		}
		n.value = this.session?.id ?? "", this.session?.error ? this.status(this.session.error, !0) : this.session?.partialStart && this.status("В начале сеанса пропущен начальный фрагмент существующего direct-потока"), await this.search();
	}
	async removeAll() {
		if (!(this.recorder.isRecording || this.starting || this.exporting || this.clearing) && this.view.confirm("Удалить ВСЕ сеансы FE и все сообщения без возможности восстановления?")) {
			this.clearing = !0, this.update();
			try {
				this.query++, this.messageView.clear(), await this.recorder.rpc({ method: "remove-all" }), await this.loadSessions(), this.status("Все сеансы FE удалены");
			} finally {
				this.clearing = !1, this.update();
			}
		}
	}
	async reloadAndRecord() {
		if (this.starting || this.exporting || this.clearing || this.reloading) throw Error("Дождитесь завершения текущей операции");
		this.reloading = !0, this.status("Сохранение истории перед перезагрузкой…"), this.update();
		try {
			await this.recorder.stop(), await this.recorder.reload();
		} catch (e) {
			throw this.reloading = !1, this.update(), e;
		}
	}
	async recordFromReload(e) {
		if (e()) try {
			this.recorder.isRecording || await this.toggleRecording(), e() ? this.status("Запись включена до первого FE-сообщения после перезагрузки") : await this.dispose();
		} catch (t) {
			throw e() ? this.status(`Не удалось подготовить запись FE: ${String(t)}`, !0) : await this.dispose().catch(() => void 0), t;
		}
	}
	async toggleRecording() {
		if (this.recorder.isRecording) {
			await this.recorder.stop(), this.status("Запись остановлена"), await this.loadSessions();
			return;
		}
		if (!this.starting) {
			this.starting = !0, this.update();
			try {
				await this.recorder.start(), await this.loadSessions(this.recorder.sessionId), this.status("Запись включена. Начальный фрагмент существующего direct-соединения пропускается при синхронизации"), navigator.storage?.persist && navigator.storage.persist().then((e) => {
					!e && !this.destroyed && this.status("Браузер не закрепил хранилище: история может быть очищена при нехватке места");
				}).catch(() => void 0);
			} finally {
				this.starting = !1, this.update();
			}
		}
	}
	async search() {
		this.query++, this.messageView.clear(), await this.recorder.rpc({ method: "cancel" });
		let e = this.element("form"), t = new FormData(e), n = (e) => String(t.get(e) ?? "").trim(), r = n("from") ? new Date(n("from")).getTime() : 0, i = n("to") ? new Date(n("to")).getTime() : 2 ** 53 - 1;
		if (!Number.isFinite(r) || !Number.isFinite(i) || r > i) throw Error("Неверный диапазон времени");
		let a = n("operator");
		this.filter = {
			sessionId: this.session?.id ?? "",
			entity: n("entity"),
			fe: n("fe"),
			direction: n("direction"),
			from: r,
			to: i,
			field: n("field"),
			value: n("value"),
			operator: a === "exists" || a === "equals" ? a : "contains"
		}, this.snapshotSeq = this.session?.count ?? 0, this.cursors = [void 0], await this.loadPage(0);
	}
	async loadPage(e) {
		if (!this.filter || e < 0) return;
		let t = ++this.query;
		this.busy = !0, this.element("#prev").disabled = !0, this.element("#next").disabled = !0;
		let n = this.element("tbody");
		n.replaceChildren(), this.element("#progress").textContent = "Поиск…";
		let r = this.session, i = {
			rows: [],
			scanned: 0,
			next: this.cursors[e]
		};
		if (r) {
			do {
				let e = await this.recorder.rpc({
					method: "page",
					filter: this.filter,
					next: i.next,
					maxSeq: this.snapshotSeq,
					limit: 100 - i.rows.length
				});
				if (t !== this.query || this.destroyed) return;
				i.scanned += e.scanned, i.rows.push(...e.rows), i.next = e.next, this.element("#progress").textContent = `Поиск… найдено ${i.rows.length}, просмотрено ${i.scanned}`;
			} while (i.rows.length < 100 && i.next);
			if (i.rows.length === 100 && i.next) {
				let e = i.next;
				for (; e;) {
					let n = await this.recorder.rpc({
						method: "page",
						filter: this.filter,
						next: e,
						maxSeq: this.snapshotSeq,
						limit: 1,
						probe: !0
					});
					if (t !== this.query || this.destroyed) return;
					if (i.scanned += n.scanned, i.next = n.next, this.element("#progress").textContent = `Поиск… найдено ${i.rows.length}, просмотрено ${i.scanned}`, n.matched) break;
					e = n.next;
				}
			}
		}
		if (!(t !== this.query || this.destroyed)) {
			this.pageIndex = e, this.next = i.next, this.busy = !1;
			for (let e of i.rows) {
				let t = document.createElement("tr");
				for (let n of [
					new Date(e.at).toLocaleTimeString() + `.${String(e.at % 1e3).padStart(3, "0")}`,
					String(e.fe),
					e.direction
				]) {
					let e = document.createElement("td");
					e.textContent = n, t.append(e);
				}
				let r = document.createElement("td");
				r.textContent = e.entity, t.tabIndex = 0, t.title = "Показать JSON этого сообщения", t.setAttribute("aria-selected", "false");
				let i = () => this.run(async () => {
					for (let e of n.children) e.setAttribute("aria-selected", String(e === t));
					await this.messageView.show(e, this.filter);
				});
				t.addEventListener("click", i), t.addEventListener("keydown", (e) => {
					(e.key === "Enter" || e.key === " ") && (e.preventDefault(), i());
				}), t.append(r), n.append(t);
			}
			this.element("#prev").disabled = e === 0 || this.busy, this.element("#next").disabled = !this.next || this.busy, this.element("#progress").textContent = ` Страница ${e + 1}: ${i.rows.length} совпадений / ${i.scanned} просмотрено`, this.update();
		}
	}
	async export() {
		let e = this.session;
		if (!e || this.exporting) return;
		let t = e.count;
		this.exporting = !0, this.update();
		let n;
		try {
			let r = this.view, i = this.container ? void 0 : r.showSaveFilePicker;
			i && (n = await (await i.call(r, { suggestedName: "fe-history.jsonl" })).createWritable());
			let a = 0, o = 0, s = 0, c = [], l = 0, u = () => {
				let e = URL.createObjectURL(new Blob(c, { type: "application/x-ndjson" })), t = document.createElement("a");
				t.href = e, t.download = `fe-history-${++s}.jsonl`, t.click(), URL.revokeObjectURL(e), c = [], l = 0;
			};
			if (e.count) for (;;) {
				let r = await this.recorder.rpc({
					method: "export",
					sessionId: e.id,
					after: a,
					offset: o,
					maxSeq: t
				});
				if (n) await n.write(r.text);
				else {
					let e = new TextEncoder().encode(r.text).byteLength;
					l + e > 16777216 && c.length && u(), c.push(r.text), l += e;
				}
				if (r.next === void 0) break;
				a = r.next, o = r.offset;
			}
			n ? (await n.close(), n = void 0) : c.length && u(), this.status("Экспорт завершён");
		} catch (e) {
			throw await n?.abort().catch(() => void 0), e;
		} finally {
			this.exporting = !1, this.update();
		}
	}
	async openPiP() {
		if (this.pip && !this.pip.closed) {
			this.pip.focus();
			return;
		}
		let e = window.documentPictureInPicture;
		if (!e) {
			this.status("Document Picture-in-Picture недоступен: используйте панель");
			return;
		}
		let t = await e.requestWindow({
			width: 1040,
			height: 650
		});
		if (this.destroyed) {
			t.close();
			return;
		}
		this.pip = t, t.document.body.style.margin = "0", this.root.classList.add("pip"), t.document.body.append(this.host), t.addEventListener("pagehide", () => {
			this.pip = void 0, !this.destroyed && (document.body.append(this.host), this.root.classList.remove("pip"), this.reveal());
		}, { once: !0 });
	}
	reveal() {
		this.hidden = !1, this.host.style.display = "", this.pip && !this.pip.closed && this.pip.focus(), this.root.focus();
	}
	setTheme(e) {
		this.host.dataset.theme = e;
	}
	destroy() {
		return this.dispose();
	}
	hide() {
		if (this.exporting || this.starting || this.clearing || this.reloading) {
			this.status("Дождитесь завершения текущей операции");
			return;
		}
		if (this.container) {
			this.run(() => this.dispose());
			return;
		}
		this.pip && this.pip.close(), this.hidden = !0, this.messageView.clear(), this.host.style.display = "none", this.recorder.isRecording || this.run(() => this.dispose());
	}
	async dispose() {
		if (!this.destroyed) {
			this.destroyed = !0, this.query++, this.messageView.destroy(), this.host.remove();
			try {
				await this.recorder.close();
			} finally {
				this.onDispose();
			}
		}
	}
};
//#endregion
//#region packages/core/src/lib/services/debugTools/feTable/devtoolsView.ts
function s(e, t, n) {
	return new o(t, n, e);
}
//#endregion
export { s as mountFEViewer };
