//#region \0rolldown/runtime.js
var e = Object.create, t = Object.defineProperty, n = Object.getOwnPropertyDescriptor, r = Object.getOwnPropertyNames, i = Object.getPrototypeOf, a = Object.prototype.hasOwnProperty, o = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), s = (e, i, o, s) => {
	if (i && typeof i == "object" || typeof i == "function") for (var c = r(i), l = 0, u = c.length, d; l < u; l++) d = c[l], !a.call(e, d) && d !== o && t(e, d, {
		get: ((e) => i[e]).bind(null, d),
		enumerable: !(s = n(i, d)) || s.enumerable
	});
	return e;
}, c = /* @__PURE__ */ ((n, r, o) => (o = n == null ? {} : e(i(n)), s(r || !n || !n.__esModule || !a.call(n, "default") ? t(o, "default", {
	value: n,
	enumerable: !0
}) : o, n)))((/* @__PURE__ */ o(((e, t) => {
	(function(e, n) {
		typeof define == "function" && define.amd ? define(n) : typeof t == "object" && t.exports ? t.exports = n() : e.log = n();
	})(e, function() {
		var e = function() {}, t = "undefined", n = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent), r = [
			"trace",
			"debug",
			"info",
			"warn",
			"error"
		], i = {}, a = null;
		function o(e, t) {
			var n = e[t];
			if (typeof n.bind == "function") return n.bind(e);
			try {
				return Function.prototype.bind.call(n, e);
			} catch {
				return function() {
					return Function.prototype.apply.apply(n, [e, arguments]);
				};
			}
		}
		function s() {
			console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace();
		}
		function c(r) {
			return r === "debug" && (r = "log"), typeof console === t ? !1 : r === "trace" && n ? s : console[r] === void 0 ? console.log === void 0 ? e : o(console, "log") : o(console, r);
		}
		function l() {
			for (var n = this.getLevel(), i = 0; i < r.length; i++) {
				var a = r[i];
				this[a] = i < n ? e : this.methodFactory(a, n, this.name);
			}
			if (this.log = this.debug, typeof console === t && n < this.levels.SILENT) return "No console available for logging";
		}
		function u(e) {
			return function() {
				typeof console !== t && (l.call(this), this[e].apply(this, arguments));
			};
		}
		function d(e, t, n) {
			return c(e) || u.apply(this, arguments);
		}
		function f(e, n) {
			var o = this, s, c, u, f = "loglevel";
			typeof e == "string" ? f += ":" + e : typeof e == "symbol" && (f = void 0);
			function p(e) {
				var n = (r[e] || "silent").toUpperCase();
				if (!(typeof window === t || !f)) {
					try {
						window.localStorage[f] = n;
						return;
					} catch {}
					try {
						window.document.cookie = encodeURIComponent(f) + "=" + n + ";";
					} catch {}
				}
			}
			function m() {
				var e;
				if (!(typeof window === t || !f)) {
					try {
						e = window.localStorage[f];
					} catch {}
					if (typeof e === t) try {
						var n = window.document.cookie, r = encodeURIComponent(f), i = n.indexOf(r + "=");
						i !== -1 && (e = /^([^;]+)/.exec(n.slice(i + r.length + 1))[1]);
					} catch {}
					return o.levels[e] === void 0 && (e = void 0), e;
				}
			}
			function h() {
				if (!(typeof window === t || !f)) {
					try {
						window.localStorage.removeItem(f);
					} catch {}
					try {
						window.document.cookie = encodeURIComponent(f) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
					} catch {}
				}
			}
			function g(e) {
				var t = e;
				if (typeof t == "string" && o.levels[t.toUpperCase()] !== void 0 && (t = o.levels[t.toUpperCase()]), typeof t == "number" && t >= 0 && t <= o.levels.SILENT) return t;
				throw TypeError("log.setLevel() called with invalid level: " + e);
			}
			o.name = e, o.levels = {
				TRACE: 0,
				DEBUG: 1,
				INFO: 2,
				WARN: 3,
				ERROR: 4,
				SILENT: 5
			}, o.methodFactory = n || d, o.getLevel = function() {
				return u ?? c ?? s;
			}, o.setLevel = function(e, t) {
				return u = g(e), t !== !1 && p(u), l.call(o);
			}, o.setDefaultLevel = function(e) {
				c = g(e), m() || o.setLevel(e, !1);
			}, o.resetLevel = function() {
				u = null, h(), l.call(o);
			}, o.enableAll = function(e) {
				o.setLevel(o.levels.TRACE, e);
			}, o.disableAll = function(e) {
				o.setLevel(o.levels.SILENT, e);
			}, o.rebuild = function() {
				if (a !== o && (s = g(a.getLevel())), l.call(o), a === o) for (var e in i) i[e].rebuild();
			}, s = g(a ? a.getLevel() : "WARN");
			var _ = m();
			_ != null && (u = g(_)), l.call(o);
		}
		a = new f(), a.getLogger = function(e) {
			if (typeof e != "symbol" && typeof e != "string" || e === "") throw TypeError("You must supply a name when creating a logger.");
			var t = i[e];
			return t ||= i[e] = new f(e, a.methodFactory), t;
		};
		var p = typeof window === t ? void 0 : window.log;
		return a.noConflict = function() {
			return typeof window !== t && window.log === a && (window.log = p), a;
		}, a.getLoggers = function() {
			return i;
		}, a.default = a, a;
	});
})))(), 1);
function l(e) {
	return [...new Uint8Array(e)].map((e) => e.toString(16).padStart(2, "0")).join("");
}
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/getArrayFieldMeta.ts
var u = (e, t, n, r = !1) => ({
	type: "array",
	width: e,
	size: t,
	isPrimitives: r,
	elements: n
}), d = /* @__PURE__ */ new Map(), f = /* @__PURE__ */ new Set(), p = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ function(e) {
	return e.StringField = "string", e.Int8Field = "int8", e.Int16Field = "int16", e.UInt32Field = "uint32", e.Int32Field = "int32", e.Int64Field = "int64", e.EnumField = "enum", e.DateTimeFiled = "datetime", e.UnknownField = "unknown", e.DoubleField = "double", e.BooleanField = "boolean", e.ArrayField = "array", e.ByteArrayField = "bytearray", e.VariantField = "variant", e.ConditionField = "condition", e.NewArrayField = "newarray", e;
}({});
function g(e, t, n) {
	if (typeof e == "function") throw Error("Static properties not supported");
	let r = e.constructor;
	if (d.has(r)) {
		let e = d.get(r);
		e && e[String(t)] === void 0 && (e[String(t)] = n);
	} else d.set(r, { [String(t)]: n });
}
function _(e = 256) {
	return (t, n) => {
		g(t, n, {
			type: "string",
			size: e
		});
	};
}
function v() {
	return (e, t) => {
		g(e, t, { type: "uint32" });
	};
}
function y() {
	return (e, t) => {
		g(e, t, { type: "int8" });
	};
}
function b() {
	return (e, t) => {
		g(e, t, { type: "int16" });
	};
}
function x() {
	return (e, t) => {
		g(e, t, { type: "int32" });
	};
}
function S() {
	return (e, t) => {
		g(e, t, { type: "int64" });
	};
}
function C() {
	return (e, t) => {
		g(e, t, { type: "variant" });
	};
}
function w(e) {
	return (t, n) => {
		g(t, n, {
			type: "condition",
			condition: e
		});
	};
}
function T(e, t, n, r = !1) {
	return (i, a) => {
		g(i, a, u(e, t, n, r));
	};
}
function E(e, t, n, r = !1) {
	return (i, a) => {
		g(i, a, {
			type: "newarray",
			width: e,
			size: t,
			isPrimitives: r,
			elements: n
		});
	};
}
function D() {
	return (e, t) => {
		g(e, t, { type: "bytearray" });
	};
}
function O() {
	return (e, t) => {
		g(e, t, { type: "boolean" });
	};
}
function k() {
	return (e, t) => {
		g(e, t, { type: "datetime" });
	};
}
function A() {
	return (e, t) => {
		g(e, t, { type: "double" });
	};
}
function j(e) {
	return (t, n) => {
		g(t, n, {
			type: "enum",
			width: e
		});
	};
}
function ee(e) {
	return (t, n) => {
		g(t, n, {
			type: "unknown",
			width: e
		});
	};
}
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/const.ts
var te = "Entity is not registred for serialization", ne = 0x89f7ff5f7b58000, re = 1e4;
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/ADEntity.ts
function M(e, t) {
	return c.default.trace(`ADEntity typeId = ${e} and ${t}`), (n) => {
		let r = d.get(n);
		if (r === void 0) throw Error("Unexpected error while initializing metadata");
		d.set(t, r), d.delete(n), p.set(e, t), m.set(t, e);
	};
}
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/ADMaskedEntity.ts
function ie(e, t) {
	return c.default.trace(`ADMaskedEntity typeId = ${e} and ${t}`), f.add(t), M(e, t);
}
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/getMeta.ts
function ae(e) {
	let t;
	if (typeof e == "string" && (t = d.get(e)), typeof e == "number") {
		let n = p.get(e);
		n && (t = d.get(n));
	}
	return t || c.default.debug(`Entity ${e} is not registred for serialization`), t;
}
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/createEntity.ts
function oe(e) {
	let t;
	if (typeof e == "string" && (t = e), typeof e == "number" && (t = p.get(e)), t) {
		let e = {};
		if (!ae(t)) throw Error(te);
		return e;
	}
	throw Error(te);
}
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/getEntityNameById.ts
function se(e) {
	return p.get(e);
}
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/isEntityMasked.ts
function ce(e) {
	if (typeof e == "string") return f.has(e);
	{
		let t = se(e);
		return t ? f.has(t) : !1;
	}
}
//#endregion
//#region packages/core/src/lib/client/entityTypes.ts
var N = /* @__PURE__ */ function(e) {
	return e.UnknownEntity = "UnknownEntity", e.Int32Element = "Int32Element", e.ADField = "ADField", e.ADMessage = "ADMessage", e.VariantTypeElement = "VariantTypeElement", e.ZoneConnectionInfo = "ZoneConnectionInfo", e.VolumeForPrice = "VolumeForPrice", e.VolumeForPriceFractional = "VolumeForPriceFractional", e.ClientRestrictions = "ClientRestrictions", e.ChartSequenceBegin = "ChartSequenceBegin", e.ClientEnterOrderExReq = "ClientEnterOrderExReq", e.ClientCancelOrderExReq = "ClientCancelOrderExReq", e.ClientEnterOrderExRsp = "ClientEnterOrderExRsp", e.ClientCancelOrderExRsp = "ClientCancelOrderExRsp", e.ChartSequenceEnd = "ChartSequenceEnd", e.ClientUchPosEntity = "ClientUchPosEntity", e.ProtocolInfo = "ProtocolInfo", e.ClientMessageEntity = "ClientMessageEntity", e.ArchiveRequestEntity = "ArchiveRequestEntity", e.AuthenticationRequestEntity = "AuthenticationRequestEntity", e.AuthorizeWithConnectionKeyEntity = "AuthorizeWithConnectionKeyEntity", e.ClientOrderEntity = "ClientOrderEntity", e.DataFlowSubscribeEntity = "DataFlowSubscribeEntity", e.DisconnectEntity = "DisconnectEntity", e.EnrollCertificateEntity = "EnrollCertificateEntity", e.HeartbeatEntity = "HeartbeatEntity", e.UpdateCertificateEntity = "UpdateCertificateEntity", e.AllowedDiscountTypeEntity = "AllowedDiscountTypeEntity", e.AllowedOrderParamEntity = "AllowedOrderParamEntity", e.AllowedPenaltyTypeEntity = "AllowedPenaltyTypeEntity", e.AllowedPriceControlTypeEntity = "AllowedPriceControlTypeEntity", e.AllowedSettleCodeEntity = "AllowedSettleCodeEntity", e.AllowOrderStatusEntity = "AllowOrderStatusEntity", e.AllTradeExEntity = "AllTradeExEntity", e.ChartArchiveEntity = "ChartArchiveEntity", e.ClientCertificateEntity = "ClientCertificateEntity", e.ClientGTSubAccountEntity = "ClientGTSubAccountEntity", e.ClientOperationEntity = "ClientOperationEntity", e.ClientObjectBalanceIdFIEntity = "ClientObjectBalanceIdFIEntity", e.ClientPositionEntity = "ClientPositionEntity", e.ClientRestrictionsEntity = "ClientRestrictionsEntity", e.ClientSubAccountEntity = "ClientSubAccountEntity", e.ContragentEntity = "ContragentEntity", e.CurrencyMarketBoardEntity = "CurrencyMarketBoardEntity", e.ExchangeEntity = "ExchangeEntity", e.FinInfoExEntity = "FinInfoExEntity", e.FinInfoExtExEntity = "FinInfoExtExEntity", e.FinInstrumentEntity = "FinInstrumentEntity", e.InitFinishedEntity = "InitFinishedEntity", e.LimitsOverflowEntity = "LimitsOverflowEntity", e.MarketBoardEntity = "MarketBoardEntity", e.MarketEntity = "MarketEntity", e.MetricEntity = "MetricEntity", e.TopVolumeInstrumetsRequestFilter = "TopVolumeInstrumetsRequestFilter", e.TopVolumeInstrumetsRequestEntity = "TopVolumeInstrumetsRequestEntity", e.TopVolumeInstrumetsResponseEntity = "TopVolumeInstrumetsResponseEntity", e.NewsEntity = "NewsEntity", e.ObjectEntity = "ObjectEntity", e.ObjectGroupEntity = "ObjectGroupEntity", e.ObjectTypeEntity = "ObjectTypeEntity", e.OrderBookExEntity = "OrderBookExEntity", e.OrderBookExLevelEntity = "OrderBookExLevelEntity", e.OrderExEntity = "OrderExEntity", e.WithdrawMoneyOrder = "WithdrawMoneyOrder", e.BankEntity = "BankEntity", e.SettleCodeEntity = "SettleCodeEntity", e.SubAccountRazdelEntity = "SubAccountRazdelEntity", e.ClientGetTradingLimitsReq = "ClientGetTradingLimitsReq", e.ClientGetTradingLimitsRsp = "ClientGetTradingLimitsRsp", e.TradePeriodStatusEntity = "TradePeriodStatusEntity", e.TSAccount4LSEntity = "TSAccount4LSEntity", e.UserCredentialsEntity = "UserCredentialsEntity", e.IntervalInfoEntity = "IntervalInfoEntity", e.ResponseForCertificateActionSMSEntity = "ResponseForCertificateActionSMSEntity", e.ResponseForCertificateActionWithSMSEntity = "ResponseForCertificateActionWithSMSEntity", e.OhlcvDataPointEntity = "OhlcvDataPointEntity", e.OhlcvDataPointFractionalEntity = "OhlcvDataPointFractionalEntity", e.ClientSubAccPositionEntity = "ClientSubAccPositionEntity", e.BaseOperationEntity = "BaseOperationEntity", e.ClientAccountEntity = "ClientAccountEntity", e.ProtocolInfoEntity = "ProtocolInfoEntity", e.CertificateRequestEntity = "CertificateRequestEntity", e.CertificateResponseEntity = "CertificateResponseEntity", e.RequestForCertificateActionSMSEntity = "RequestForCertificateActionSMSEntity", e.CandleStandardDbEntity = "CandleStandardDbEntity", e.RequestForCertificateActionWithSMSEntity = "RequestForCertificateActionWithSMSEntity", e.ArchiveRequest3Entity = "ArchiveRequest3Entity", e.PassportAuthenticationRequestEntity = "PassportAuthenticationRequestEntity", e.BrokerRecommendationEntity = "BrokerRecommendationEntity", e.ChatMessageEntity = "ChatMessageEntity", e.ChatGroupEntity = "ChatGroupEntity", e.ObjectExtEntity = "ObjectExtEntity", e.MpvDataPointEntity = "MpvDataPointEntity", e.MpvDataPointFractionalEntity = "MpvDataPointFractionalEntity", e.ResetDataRequestEntity = "ResetDataRequestEntity", e.TrackPriceEntity = "TrackPriceEntity", e.NotificationSubscriptionEntity = "NotificationSubscriptionEntity", e.NotificationSubscriptionStateEntity = "NotificationSubscriptionStateEntity", e.TradeShortNoticeRequest = "TradeShortNoticeRequest", e.TradeShortNoticeObject = "TradeShortNoticeObject", e.TradeShortNoticeResponse = "TradeShortNoticeResponse", e.ClientMoneyAccountEntity = "ClientMoneyAccountEntity", e.ClientGetMarketOrderValueReq = "ClientGetMarketOrderValueReq", e.ClientGetMarketOrderValueRsp = "ClientGetMarketOrderValueRsp", e.WithdrawPartnerAssetOrder = "WithdrawPartnerAssetOrder", e.ClientGetInstrumentInfoExtReq = "ClientGetInstrumentInfoExtReq", e.ClientGetInstrumentInfoExtRsp = "ClientGetInstrumentInfoExtRsp", e.ClientGetInstrumentInfoByUniversalCodesExtReq = "ClientGetInstrumentInfoByUniversalCodesExtReq", e.ClientGetInstrumentInfoByUniversalCodesExtRsp = "ClientGetInstrumentInfoByUniversalCodesExtRsp", e.InstrumentInfoExtEntity = "InstrumentInfoExtEntity", e.UniversalCodesInfo = "UniversalCodesInfo", e;
}({}), le = (e) => {
	switch (e) {
		case de.Standard: return N.OhlcvDataPointEntity;
		case de.StandardFractional: return N.OhlcvDataPointFractionalEntity;
		case de.MPVFractional: return N.MpvDataPointFractionalEntity;
		default: return N.MpvDataPointEntity;
	}
};
//#endregion
//#region \0@oxc-project+runtime@0.144.0/helpers/esm/decorate.js
function P(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region packages/core/src/lib/client/entities.ts
var ue = N.UnknownEntity, de = /* @__PURE__ */ function(e) {
	return e[e.Standard = 0] = "Standard", e[e.VolumeBidAsk = 1] = "VolumeBidAsk", e[e.MPV = 2] = "MPV", e[e.StandardFractional = 3] = "StandardFractional", e[e.MPVFractional = 4] = "MPVFractional", e;
}({}), F = class {}, fe = class extends F {
	Int32Element;
};
P([x()], fe.prototype, "Int32Element", void 0), fe = P([M(-1, N.Int32Element)], fe);
var pe = class extends F {
	Date;
	Hash;
};
P([k()], pe.prototype, "Date", void 0), P([S()], pe.prototype, "Hash", void 0), pe = P([M(-3, N.IntervalInfoEntity)], pe);
var me = class extends F {
	Name;
	Type;
	StructTypeName;
	Array;
	Size;
	Nullable;
};
P([_(50)], me.prototype, "Name", void 0), P([j(1)], me.prototype, "Type", void 0), P([_(50)], me.prototype, "StructTypeName", void 0), P([O()], me.prototype, "Array", void 0), P([x()], me.prototype, "Size", void 0), P([O()], me.prototype, "Nullable", void 0), me = P([M(-4, N.ADField)], me);
var he = class extends F {
	ID;
	Name;
	Mask;
	Direction;
	Fields;
};
P([j(2)], he.prototype, "ID", void 0), P([_(50)], he.prototype, "Name", void 0), P([j(1)], he.prototype, "Mask", void 0), P([j(1)], he.prototype, "Direction", void 0), P([T(-1, 255, "ADField")], he.prototype, "Fields", void 0), he = P([M(-5, N.ADMessage)], he);
var ge = class extends F {
	VariantElement;
};
P([C()], ge.prototype, "VariantElement", void 0), ge = P([M(-6, N.VariantTypeElement)], ge);
var _e = class extends F {
	FrontEndType;
	ConnectionKey;
};
P([x()], _e.prototype, "FrontEndType", void 0), P([S()], _e.prototype, "ConnectionKey", void 0), _e = P([M(-7, N.ZoneConnectionInfo)], _e);
var ve = class extends F {
	Price;
	Volume;
	VolumeAsk;
};
P([A()], ve.prototype, "Price", void 0), P([S()], ve.prototype, "Volume", void 0), P([S()], ve.prototype, "VolumeAsk", void 0), ve = P([M(-8, N.VolumeForPrice)], ve);
var ye = class extends F {
	Price;
	Volume;
	VolumeAsk;
};
P([A()], ye.prototype, "Price", void 0), P([A()], ye.prototype, "Volume", void 0), P([A()], ye.prototype, "VolumeAsk", void 0), ye = P([M(-9, N.VolumeForPriceFractional)], ye);
var be = class extends F {
	Price;
	BuyQty;
	SellQty;
	Yield;
	Revision;
	LineId;
	OldPrice;
};
P([A()], be.prototype, "Price", void 0), P([A()], be.prototype, "BuyQty", void 0), P([A()], be.prototype, "SellQty", void 0), P([A()], be.prototype, "Yield", void 0), P([S()], be.prototype, "Revision", void 0), P([y()], be.prototype, "LineId", void 0), P([A()], be.prototype, "OldPrice", void 0), be = P([ie(46, N.OrderBookExLevelEntity)], be);
var xe = class extends F {
	IdAllowedOrderParams;
	IdObjectGroup;
	IdMarketBoard;
	IdDocumentType;
	IdOrderType;
	IdQuantityType;
	IdPriceType;
	IdLifeTime;
	IdExecutionType;
	Version;
	Operation;
};
P([x()], xe.prototype, "IdAllowedOrderParams", void 0), P([j(4)], xe.prototype, "IdObjectGroup", void 0), P([x()], xe.prototype, "IdMarketBoard", void 0), P([j(1)], xe.prototype, "IdDocumentType", void 0), P([j(1)], xe.prototype, "IdOrderType", void 0), P([j(1)], xe.prototype, "IdQuantityType", void 0), P([j(1)], xe.prototype, "IdPriceType", void 0), P([j(1)], xe.prototype, "IdLifeTime", void 0), P([j(1)], xe.prototype, "IdExecutionType", void 0), P([S()], xe.prototype, "Version", void 0), P([j(1)], xe.prototype, "Operation", void 0), xe = P([M(1, N.AllowedOrderParamEntity)], xe);
var Se = class extends F {
	IdObject;
	IdObjectType;
	IdObjectFaceUnit;
	IdObjectBase;
	IdIndustry;
	SymbolObject;
	NameObject;
	DescObject;
	RegCodeObject;
	Nominal;
	Mult;
	MatDateObject;
	Expired;
	IsEnabledObject;
	Version;
	Operation;
	Isin;
	Options;
};
P([x()], Se.prototype, "IdObject", void 0), P([j(4)], Se.prototype, "IdObjectType", void 0), P([x()], Se.prototype, "IdObjectFaceUnit", void 0), P([x()], Se.prototype, "IdObjectBase", void 0), P([x()], Se.prototype, "IdIndustry", void 0), P([_(18)], Se.prototype, "SymbolObject", void 0), P([_(245)], Se.prototype, "NameObject", void 0), P([_(1024)], Se.prototype, "DescObject", void 0), P([_(256)], Se.prototype, "RegCodeObject", void 0), P([A()], Se.prototype, "Nominal", void 0), P([A()], Se.prototype, "Mult", void 0), P([k()], Se.prototype, "MatDateObject", void 0), P([ee(2)], Se.prototype, "Expired", void 0), P([O()], Se.prototype, "IsEnabledObject", void 0), P([S()], Se.prototype, "Version", void 0), P([j(1)], Se.prototype, "Operation", void 0), P([_(30)], Se.prototype, "Isin", void 0), P([j(8)], Se.prototype, "Options", void 0), Se = P([M(14, N.ObjectEntity)], Se);
var Ce = class extends F {
	IdObjectType;
	CodeObjectType;
	NameObjectType;
	IdObjectGroup;
	ShortNameObjectType;
	Version;
	Operation;
};
P([x()], Ce.prototype, "IdObjectType", void 0), P([_(256)], Ce.prototype, "CodeObjectType", void 0), P([_(256)], Ce.prototype, "NameObjectType", void 0), P([j(4)], Ce.prototype, "IdObjectGroup", void 0), P([_(256)], Ce.prototype, "ShortNameObjectType", void 0), P([S()], Ce.prototype, "Version", void 0), P([j(1)], Ce.prototype, "Operation", void 0), Ce = P([M(17, N.ObjectTypeEntity)], Ce);
var I = class extends F {
	Operation;
	IdAccount;
	IdSubAccount;
	IdRazdel;
	NumEDocument;
	NumEDocumentBase;
	ClientNumStrategy;
	ClientOrderNum;
	IdObject;
	IdMarketBoard;
	IdFI;
	IdSettleCode;
	OrderType;
	QuantityType;
	PriceType;
	LifeTime;
	ExecutionType;
	PriceControlType;
	BuySell;
	DocumentType;
	Price;
	ClientPrice;
	StopPrice;
	ClientPrice2;
	Amount;
	MaxFloor;
	Value;
	OrderStatus;
	OrderStatusRevision;
	SignTime;
	AcceptTime;
	WithdrawTime;
	OrderUpdateTime;
	ExtSessId;
	ExtOrderNum;
	Rest;
	ConfirmedAmount;
	ClientNumEDocument;
	ActivationTime;
	IdFIActivate;
	ActivationPriceDirection;
	RepoDate;
	RefundRate;
	SDiscount;
	LowerDiscount;
	UpperDiscount;
	Comment;
	Contragent;
	ContragentRef;
	BrokerComment;
	BrokerErrorCode;
	Login;
	Flags;
	SentTime;
	CancelTime;
	SendCompletedTime;
	TerminatedTime;
	ExchangeTime;
	ExchangeTerminatedTime;
	TradeNo;
	CancelNumEDocument;
};
P([j(1)], I.prototype, "Operation", void 0), P([x()], I.prototype, "IdAccount", void 0), P([x()], I.prototype, "IdSubAccount", void 0), P([x()], I.prototype, "IdRazdel", void 0), P([S()], I.prototype, "NumEDocument", void 0), P([S()], I.prototype, "NumEDocumentBase", void 0), P([x()], I.prototype, "ClientNumStrategy", void 0), P([S()], I.prototype, "ClientOrderNum", void 0), P([x()], I.prototype, "IdObject", void 0), P([x()], I.prototype, "IdMarketBoard", void 0), P([x()], I.prototype, "IdFI", void 0), P([x()], I.prototype, "IdSettleCode", void 0), P([j(1)], I.prototype, "OrderType", void 0), P([j(1)], I.prototype, "QuantityType", void 0), P([j(1)], I.prototype, "PriceType", void 0), P([j(1)], I.prototype, "LifeTime", void 0), P([j(1)], I.prototype, "ExecutionType", void 0), P([j(1)], I.prototype, "PriceControlType", void 0), P([j(2)], I.prototype, "BuySell", void 0), P([j(1)], I.prototype, "DocumentType", void 0), P([A()], I.prototype, "Price", void 0), P([A()], I.prototype, "ClientPrice", void 0), P([A()], I.prototype, "StopPrice", void 0), P([A()], I.prototype, "ClientPrice2", void 0), P([A()], I.prototype, "Amount", void 0), P([A()], I.prototype, "MaxFloor", void 0), P([A()], I.prototype, "Value", void 0), P([j(4)], I.prototype, "OrderStatus", void 0), P([x()], I.prototype, "OrderStatusRevision", void 0), P([k()], I.prototype, "SignTime", void 0), P([k()], I.prototype, "AcceptTime", void 0), P([k()], I.prototype, "WithdrawTime", void 0), P([S()], I.prototype, "OrderUpdateTime", void 0), P([x()], I.prototype, "ExtSessId", void 0), P([S()], I.prototype, "ExtOrderNum", void 0), P([A()], I.prototype, "Rest", void 0), P([A()], I.prototype, "ConfirmedAmount", void 0), P([_(128)], I.prototype, "ClientNumEDocument", void 0), P([k()], I.prototype, "ActivationTime", void 0), P([x()], I.prototype, "IdFIActivate", void 0), P([j(2)], I.prototype, "ActivationPriceDirection", void 0), P([S()], I.prototype, "RepoDate", void 0), P([A()], I.prototype, "RefundRate", void 0), P([A()], I.prototype, "SDiscount", void 0), P([A()], I.prototype, "LowerDiscount", void 0), P([A()], I.prototype, "UpperDiscount", void 0), P([_(1024)], I.prototype, "Comment", void 0), P([_(50)], I.prototype, "Contragent", void 0), P([_(100)], I.prototype, "ContragentRef", void 0), P([_(400)], I.prototype, "BrokerComment", void 0), P([j(4)], I.prototype, "BrokerErrorCode", void 0), P([_(50)], I.prototype, "Login", void 0), P([j(8)], I.prototype, "Flags", void 0), P([k()], I.prototype, "SentTime", void 0), P([k()], I.prototype, "CancelTime", void 0), P([k()], I.prototype, "SendCompletedTime", void 0), P([k()], I.prototype, "TerminatedTime", void 0), P([k()], I.prototype, "ExchangeTime", void 0), P([k()], I.prototype, "ExchangeTerminatedTime", void 0), P([S()], I.prototype, "TradeNo", void 0), P([S()], I.prototype, "CancelNumEDocument", void 0), I = P([ie(709, N.OrderExEntity)], I);
var L = class extends F {
	IdAccount;
	IdSubAccount;
	ClientOrderNum;
	IdRazdel;
	MoneyAccount;
	IdObjectCurrency;
	AccNo;
	BranchId;
	Bic;
	CorAcc;
	Amount;
	Channel;
	SignType;
	Comment;
	NumEDocument;
	IdOrderStatus;
	OrderStatusRevision;
	ExtOrderNum;
	Rest;
	OrderUpdateTime;
	AcceptTime;
	BrokerErrorCode;
	BrokerComment;
	Operation;
};
P([x()], L.prototype, "IdAccount", void 0), P([x()], L.prototype, "IdSubAccount", void 0), P([v()], L.prototype, "ClientOrderNum", void 0), P([x()], L.prototype, "IdRazdel", void 0), P([_(21)], L.prototype, "MoneyAccount", void 0), P([x()], L.prototype, "IdObjectCurrency", void 0), P([_(21)], L.prototype, "AccNo", void 0), P([x()], L.prototype, "BranchId", void 0), P([_(20)], L.prototype, "Bic", void 0), P([_(21)], L.prototype, "CorAcc", void 0), P([A()], L.prototype, "Amount", void 0), P([j(4)], L.prototype, "Channel", void 0), P([j(1)], L.prototype, "SignType", void 0), P([_(256)], L.prototype, "Comment", void 0), P([S()], L.prototype, "NumEDocument", void 0), P([j(4)], L.prototype, "IdOrderStatus", void 0), P([x()], L.prototype, "OrderStatusRevision", void 0), P([S()], L.prototype, "ExtOrderNum", void 0), P([A()], L.prototype, "Rest", void 0), P([S()], L.prototype, "OrderUpdateTime", void 0), P([k()], L.prototype, "AcceptTime", void 0), P([j(4)], L.prototype, "BrokerErrorCode", void 0), P([_(400)], L.prototype, "BrokerComment", void 0), P([j(1)], L.prototype, "Operation", void 0), L = P([M(403, N.WithdrawMoneyOrder)], L);
var we = class extends F {
	CommandType;
	DT;
	TotalAttemptsMAX;
	CountMaxDt;
	InnerCountMac;
};
P([j(2)], we.prototype, "CommandType", void 0), P([S()], we.prototype, "DT", void 0), P([x()], we.prototype, "TotalAttemptsMAX", void 0), P([x()], we.prototype, "CountMaxDt", void 0), P([x()], we.prototype, "InnerCountMac", void 0), we = P([M(19, N.ClientRestrictions)], we);
var Te = class extends F {
	IdChatGroup;
	NameChatGroup;
	ifEnable;
	IdLoginChatGroup;
	ConfirmReading;
	Version;
	Operation;
	IdRole;
	IdClientStrategy;
	NameClientStrategy;
	Message;
	IdState;
	NextActiveDate;
};
P([x()], Te.prototype, "IdChatGroup", void 0), P([_()], Te.prototype, "NameChatGroup", void 0), P([x()], Te.prototype, "ifEnable", void 0), P([x()], Te.prototype, "IdLoginChatGroup", void 0), P([O()], Te.prototype, "ConfirmReading", void 0), P([S()], Te.prototype, "Version", void 0), P([j(1)], Te.prototype, "Operation", void 0), P([j(1)], Te.prototype, "IdRole", void 0), P([x()], Te.prototype, "IdClientStrategy", void 0), P([_()], Te.prototype, "NameClientStrategy", void 0), P([_()], Te.prototype, "Message", void 0), P([j(4)], Te.prototype, "IdState", void 0), P([k()], Te.prototype, "NextActiveDate", void 0), Te = P([M(20, N.ChatGroupEntity)], Te);
var R = class extends F {
	Version;
	Operation;
	IdBrokerRecommendation;
	AcceptTime;
	IdClientStrategy;
	IdFi;
	IdMarketBoard;
	BuySell;
	IdOrderType;
	Price;
	Quantity;
	IdLifeTime;
	Comment;
	Flags;
	IdChatGroup;
	IdQuantityType;
	IdSubAccount;
	StopPrice;
	LimitLevelAlternative;
};
P([S()], R.prototype, "Version", void 0), P([j(1)], R.prototype, "Operation", void 0), P([x()], R.prototype, "IdBrokerRecommendation", void 0), P([k()], R.prototype, "AcceptTime", void 0), P([x()], R.prototype, "IdClientStrategy", void 0), P([x()], R.prototype, "IdFi", void 0), P([x()], R.prototype, "IdMarketBoard", void 0), P([j(2)], R.prototype, "BuySell", void 0), P([j(1)], R.prototype, "IdOrderType", void 0), P([A()], R.prototype, "Price", void 0), P([x()], R.prototype, "Quantity", void 0), P([j(1)], R.prototype, "IdLifeTime", void 0), P([_()], R.prototype, "Comment", void 0), P([j(1)], R.prototype, "Flags", void 0), P([x()], R.prototype, "IdChatGroup", void 0), P([j(1)], R.prototype, "IdQuantityType", void 0), P([x()], R.prototype, "IdSubAccount", void 0), P([A()], R.prototype, "StopPrice", void 0), P([A()], R.prototype, "LimitLevelAlternative", void 0), R = P([M(321, N.BrokerRecommendationEntity)], R);
var Ee = class extends F {
	IdChatMessage;
	IdSender;
	SenderNickname;
	IdRecipient;
	RecipientNickname;
	IdChatGroup;
	DtChatMessage;
	Text;
	Version;
	Operation;
	IdBrokerRecommendation;
	BrokerRecommendation;
};
P([x()], Ee.prototype, "IdChatMessage", void 0), P([x()], Ee.prototype, "IdSender", void 0), P([_()], Ee.prototype, "SenderNickname", void 0), P([x()], Ee.prototype, "IdRecipient", void 0), P([_()], Ee.prototype, "RecipientNickname", void 0), P([x()], Ee.prototype, "IdChatGroup", void 0), P([k()], Ee.prototype, "DtChatMessage", void 0), P([_()], Ee.prototype, "Text", void 0), P([S()], Ee.prototype, "Version", void 0), P([j(1)], Ee.prototype, "Operation", void 0), P([x()], Ee.prototype, "IdBrokerRecommendation", void 0), P([T(-1, 1, N.BrokerRecommendationEntity)], Ee.prototype, "BrokerRecommendation", void 0), Ee = P([M(22, N.ChatMessageEntity)], Ee);
var De = class extends F {
	IdLogin;
	MessageId;
	Objects;
	ClientMessageFlags;
};
P([x()], De.prototype, "IdLogin", void 0), P([x()], De.prototype, "MessageId", void 0), P([T(-1, -1, N.VariantTypeElement, !0)], De.prototype, "Objects", void 0), P([x()], De.prototype, "ClientMessageFlags", void 0), De = P([M(26, N.ClientMessageEntity)], De);
var Oe = class extends F {
	SendTime;
	ReceieveTime;
	ReplyTime;
};
P([k()], Oe.prototype, "SendTime", void 0), P([k()], Oe.prototype, "ReceieveTime", void 0), P([k()], Oe.prototype, "ReplyTime", void 0), Oe = P([M(39, N.HeartbeatEntity)], Oe);
var z = class extends F {
	IdFI;
	IdBoard;
	IdGate;
	TradingStatus;
	ExtSessId;
	LastPx;
	LastQty;
	LastTime;
	BidPx;
	AskPx;
	Yield;
	Duration;
	BidQty;
	AskQty;
	SumBid;
	SumAsk;
	NumBids;
	NumAsks;
	HighPx;
	LowPx;
	WAPx;
	YieldWAPx;
	NumTrades;
	VolToday;
	ValToday;
	Pos;
	HighBid;
	LowOffer;
	QuotePx;
	QuoteTime;
	ExTime;
	Revision;
	MinCurLast;
	OpenPx;
	PrevWAPx;
	Flags;
};
P([x()], z.prototype, "IdFI", void 0), P([x()], z.prototype, "IdBoard", void 0), P([x()], z.prototype, "IdGate", void 0), P([j(4)], z.prototype, "TradingStatus", void 0), P([x()], z.prototype, "ExtSessId", void 0), P([A()], z.prototype, "LastPx", void 0), P([A()], z.prototype, "LastQty", void 0), P([k()], z.prototype, "LastTime", void 0), P([A()], z.prototype, "BidPx", void 0), P([A()], z.prototype, "AskPx", void 0), P([A()], z.prototype, "Yield", void 0), P([A()], z.prototype, "Duration", void 0), P([A()], z.prototype, "BidQty", void 0), P([A()], z.prototype, "AskQty", void 0), P([A()], z.prototype, "SumBid", void 0), P([A()], z.prototype, "SumAsk", void 0), P([v()], z.prototype, "NumBids", void 0), P([v()], z.prototype, "NumAsks", void 0), P([A()], z.prototype, "HighPx", void 0), P([A()], z.prototype, "LowPx", void 0), P([A()], z.prototype, "WAPx", void 0), P([A()], z.prototype, "YieldWAPx", void 0), P([S()], z.prototype, "NumTrades", void 0), P([A()], z.prototype, "VolToday", void 0), P([A()], z.prototype, "ValToday", void 0), P([A()], z.prototype, "Pos", void 0), P([A()], z.prototype, "HighBid", void 0), P([A()], z.prototype, "LowOffer", void 0), P([A()], z.prototype, "QuotePx", void 0), P([k()], z.prototype, "QuoteTime", void 0), P([k()], z.prototype, "ExTime", void 0), P([S()], z.prototype, "Revision", void 0), P([A()], z.prototype, "MinCurLast", void 0), P([A()], z.prototype, "OpenPx", void 0), P([A()], z.prototype, "PrevWAPx", void 0), P([j(1)], z.prototype, "Flags", void 0), z = P([ie(50, N.FinInfoExEntity)], z);
var B = class extends F {
	Version;
	Operation;
	IdFI;
	IdGate;
	IdMarket;
	IdBoard;
	AllowInstrumentStatus;
	AllowOrderStatus;
	ExtSessId;
	SessionDate;
	Lot;
	PriceStep;
	PriceStepCost;
	IdObjectCurrency;
	Rate;
	PSTNKD;
	UpPrice;
	DownPrice;
	GtBuy;
	GtSell;
	AgentCode;
	AuctActivationDate;
	CounterPrice;
	PrevSessionId;
	PrevSessionDate;
	PrevQuote;
	PrevLastDate;
	PrevLast;
	NextCoupon;
	BuyBackDate;
	CouponPeriod;
	Duration;
	AccruedInt;
	CouponValue;
	CloseYield;
	YieldAtPrevWaPrice;
	FairPrice;
	PrevFairPrice;
	PrevFairPriceDate;
	IcebergMinAmount;
	IcebergMinMaxFloor;
};
P([S()], B.prototype, "Version", void 0), P([j(1)], B.prototype, "Operation", void 0), P([x()], B.prototype, "IdFI", void 0), P([x()], B.prototype, "IdGate", void 0), P([x()], B.prototype, "IdMarket", void 0), P([x()], B.prototype, "IdBoard", void 0), P([j(4)], B.prototype, "AllowInstrumentStatus", void 0), P([x()], B.prototype, "AllowOrderStatus", void 0), P([x()], B.prototype, "ExtSessId", void 0), P([k()], B.prototype, "SessionDate", void 0), P([A()], B.prototype, "Lot", void 0), P([A()], B.prototype, "PriceStep", void 0), P([A()], B.prototype, "PriceStepCost", void 0), P([x()], B.prototype, "IdObjectCurrency", void 0), P([A()], B.prototype, "Rate", void 0), P([A()], B.prototype, "PSTNKD", void 0), P([A()], B.prototype, "UpPrice", void 0), P([A()], B.prototype, "DownPrice", void 0), P([A()], B.prototype, "GtBuy", void 0), P([A()], B.prototype, "GtSell", void 0), P([_(256)], B.prototype, "AgentCode", void 0), P([k()], B.prototype, "AuctActivationDate", void 0), P([A()], B.prototype, "CounterPrice", void 0), P([x()], B.prototype, "PrevSessionId", void 0), P([k()], B.prototype, "PrevSessionDate", void 0), P([A()], B.prototype, "PrevQuote", void 0), P([k()], B.prototype, "PrevLastDate", void 0), P([A()], B.prototype, "PrevLast", void 0), P([k()], B.prototype, "NextCoupon", void 0), P([k()], B.prototype, "BuyBackDate", void 0), P([x()], B.prototype, "CouponPeriod", void 0), P([A()], B.prototype, "Duration", void 0), P([A()], B.prototype, "AccruedInt", void 0), P([A()], B.prototype, "CouponValue", void 0), P([A()], B.prototype, "CloseYield", void 0), P([A()], B.prototype, "YieldAtPrevWaPrice", void 0), P([A()], B.prototype, "FairPrice", void 0), P([A()], B.prototype, "PrevFairPrice", void 0), P([k()], B.prototype, "PrevFairPriceDate", void 0), P([A()], B.prototype, "IcebergMinAmount", void 0), P([A()], B.prototype, "IcebergMinMaxFloor", void 0), B = P([M(712, N.FinInfoExtExEntity)], B);
var V = class extends F {
	IdMarketBoard;
	IdMarketType;
	IdGate;
	IdBoardType;
	CodeMarketBoard;
	NameMarketBoard;
	DescMargetBoard;
	IdSettleCode;
	RCode;
	IdObjectCurrency;
	Version;
	Operation;
	IdRazdelTypeCurrency;
	IdObjectFee;
	IdRazdelTypeFee;
	IsWarrantySupply;
	IdGateManual;
	Type;
	PlaceCode;
	UniversalMarketCode;
	IsShowInTerminal;
	LegalMarketName;
};
P([x()], V.prototype, "IdMarketBoard", void 0), P([j(4)], V.prototype, "IdMarketType", void 0), P([x()], V.prototype, "IdGate", void 0), P([j(4)], V.prototype, "IdBoardType", void 0), P([_()], V.prototype, "CodeMarketBoard", void 0), P([_()], V.prototype, "NameMarketBoard", void 0), P([_()], V.prototype, "DescMargetBoard", void 0), P([x()], V.prototype, "IdSettleCode", void 0), P([_()], V.prototype, "RCode", void 0), P([x()], V.prototype, "IdObjectCurrency", void 0), P([S()], V.prototype, "Version", void 0), P([j(1)], V.prototype, "Operation", void 0), P([x()], V.prototype, "IdRazdelTypeCurrency", void 0), P([x()], V.prototype, "IdObjectFee", void 0), P([x()], V.prototype, "IdRazdelTypeFee", void 0), P([O()], V.prototype, "IsWarrantySupply", void 0), P([x()], V.prototype, "IdGateManual", void 0), P([j(8)], V.prototype, "Type", void 0), P([_()], V.prototype, "PlaceCode", void 0), P([_(63)], V.prototype, "UniversalMarketCode", void 0), P([O()], V.prototype, "IsShowInTerminal", void 0), P([_(256)], V.prototype, "LegalMarketName", void 0), V = P([M(34, N.MarketBoardEntity)], V);
var ke = class extends F {
	IdMarket;
	CodeMarket;
	NameMarket;
	IdExchange;
	Version;
	Operation;
};
P([x()], ke.prototype, "IdMarket", void 0), P([_()], ke.prototype, "CodeMarket", void 0), P([_()], ke.prototype, "NameMarket", void 0), P([x()], ke.prototype, "IdExchange", void 0), P([S()], ke.prototype, "Version", void 0), P([j(1)], ke.prototype, "Operation", void 0), ke = P([M(35, N.MarketEntity)], ke);
var Ae = class extends F {
	BankId;
	Bic;
	Name;
	CorAcc;
	Version;
	Operation;
};
P([x()], Ae.prototype, "BankId", void 0), P([_(20)], Ae.prototype, "Bic", void 0), P([_(100)], Ae.prototype, "Name", void 0), P([_(21)], Ae.prototype, "CorAcc", void 0), P([S()], Ae.prototype, "Version", void 0), P([j(1)], Ae.prototype, "Operation", void 0), Ae = P([M(414, N.BankEntity)], Ae);
var je = class extends F {
	IdExchange;
	CodeExchange;
	NameExchange;
	Version;
	Operation;
};
P([x()], je.prototype, "IdExchange", void 0), P([_()], je.prototype, "CodeExchange", void 0), P([_()], je.prototype, "NameExchange", void 0), P([S()], je.prototype, "Version", void 0), P([j(1)], je.prototype, "Operation", void 0), je = P([M(30, N.ExchangeEntity)], je);
var Me = class extends F {
	IdFI;
	IdObject;
	IdMarketBoard;
	IdGate;
	Version;
	Operation;
	Options;
};
P([x()], Me.prototype, "IdFI", void 0), P([x()], Me.prototype, "IdObject", void 0), P([x()], Me.prototype, "IdMarketBoard", void 0), P([x()], Me.prototype, "IdGate", void 0), P([S()], Me.prototype, "Version", void 0), P([j(1)], Me.prototype, "Operation", void 0), P([j(4)], Me.prototype, "Options", void 0), Me = P([M(33, N.FinInstrumentEntity)], Me);
var Ne = class extends F {
	IdFI;
	IdBoard;
	IdGate;
	Revision;
	Flags;
	BATime;
	Lines;
};
P([x()], Ne.prototype, "IdFI", void 0), P([x()], Ne.prototype, "IdBoard", void 0), P([x()], Ne.prototype, "IdGate", void 0), P([S()], Ne.prototype, "Revision", void 0), P([j(1)], Ne.prototype, "Flags", void 0), P([k()], Ne.prototype, "BATime", void 0), P([E(-1, 40, N.OrderBookExLevelEntity)], Ne.prototype, "Lines", void 0), Ne = P([M(47, N.OrderBookExEntity)], Ne);
var Pe = class extends F {
	IdAccount;
	IdSubAccount;
	BackDate;
	BackBal;
	BackPL;
	Version;
	Operation;
};
P([x()], Pe.prototype, "IdAccount", void 0), P([x()], Pe.prototype, "IdSubAccount", void 0), P([k()], Pe.prototype, "BackDate", void 0), P([A()], Pe.prototype, "BackBal", void 0), P([A()], Pe.prototype, "BackPL", void 0), P([S()], Pe.prototype, "Version", void 0), P([j(1)], Pe.prototype, "Operation", void 0), Pe = P([M(43, N.ClientSubAccountEntity)], Pe);
var Fe = class extends F {
	IdAccount;
	IdSubAccount;
	PortfolioCost;
	MarginInitial;
	MarginRequirement;
	IdMarginRequirement;
	IdRazdelGroup;
	Version;
	Operation;
	Deposit;
	CalcTime;
};
P([x()], Fe.prototype, "IdAccount", void 0), P([x()], Fe.prototype, "IdSubAccount", void 0), P([A()], Fe.prototype, "PortfolioCost", void 0), P([A()], Fe.prototype, "MarginInitial", void 0), P([A()], Fe.prototype, "MarginRequirement", void 0), P([x()], Fe.prototype, "IdMarginRequirement", void 0), P([j(4)], Fe.prototype, "IdRazdelGroup", void 0), P([S()], Fe.prototype, "Version", void 0), P([j(1)], Fe.prototype, "Operation", void 0), P([A()], Fe.prototype, "Deposit", void 0), P([k()], Fe.prototype, "CalcTime", void 0), Fe = P([M(45, N.ClientGTSubAccountEntity)], Fe);
var H = class extends F {
	IdAccount;
	MargKoef;
	IdTarif;
	TaxRate;
	BackTaxSaldo;
	IdScheme;
	BackDate;
	Version;
	Operation;
	QLevel;
	IIAType;
	MICEX_FeeRate;
	SELT_FeeRate;
	SPBEX_RPSFeeRate;
	SPBEX_FeeRate;
	SPBEX_OneCentFeeFlag;
	OTC_FeeRate;
	EFR;
	MicroInvest;
	Options;
	IdAccountStatus;
	IdMarginAccountGroup;
};
P([x()], H.prototype, "IdAccount", void 0), P([A()], H.prototype, "MargKoef", void 0), P([x()], H.prototype, "IdTarif", void 0), P([A()], H.prototype, "TaxRate", void 0), P([A()], H.prototype, "BackTaxSaldo", void 0), P([x()], H.prototype, "IdScheme", void 0), P([k()], H.prototype, "BackDate", void 0), P([S()], H.prototype, "Version", void 0), P([j(1)], H.prototype, "Operation", void 0), P([x()], H.prototype, "QLevel", void 0), P([j(1)], H.prototype, "IIAType", void 0), P([A()], H.prototype, "MICEX_FeeRate", void 0), P([A()], H.prototype, "SELT_FeeRate", void 0), P([A()], H.prototype, "SPBEX_RPSFeeRate", void 0), P([A()], H.prototype, "SPBEX_FeeRate", void 0), P([O()], H.prototype, "SPBEX_OneCentFeeFlag", void 0), P([A()], H.prototype, "OTC_FeeRate", void 0), P([O()], H.prototype, "EFR", void 0), P([O()], H.prototype, "MicroInvest", void 0), P([S()], H.prototype, "Options", void 0), P([j(1)], H.prototype, "IdAccountStatus", void 0), P([x()], H.prototype, "IdMarginAccountGroup", void 0), H = P([M(48, N.ClientAccountEntity)], H);
var Ie = class extends F {
	IdFI;
	IdGate;
	TradeNo;
	TradeTime;
	Type;
	TradingStatus;
	ExtSessId;
	IdBoard;
	BuySell;
	Price;
	Yield;
	Qty;
	Value;
	RepoRate;
	RepoDays;
	Pos;
	Revision;
	SettleCode;
};
P([x()], Ie.prototype, "IdFI", void 0), P([x()], Ie.prototype, "IdGate", void 0), P([S()], Ie.prototype, "TradeNo", void 0), P([k()], Ie.prototype, "TradeTime", void 0), P([j(4)], Ie.prototype, "Type", void 0), P([j(4)], Ie.prototype, "TradingStatus", void 0), P([x()], Ie.prototype, "ExtSessId", void 0), P([x()], Ie.prototype, "IdBoard", void 0), P([j(2)], Ie.prototype, "BuySell", void 0), P([A()], Ie.prototype, "Price", void 0), P([A()], Ie.prototype, "Yield", void 0), P([A()], Ie.prototype, "Qty", void 0), P([A()], Ie.prototype, "Value", void 0), P([A()], Ie.prototype, "RepoRate", void 0), P([x()], Ie.prototype, "RepoDays", void 0), P([S()], Ie.prototype, "Pos", void 0), P([S()], Ie.prototype, "Revision", void 0), P([_(13)], Ie.prototype, "SettleCode", void 0), Ie = P([M(51, N.AllTradeExEntity)], Ie);
var Le = class extends F {
	Login;
	FullName;
	MessageId;
	ProtocolVersion;
	OrderPrefix;
	ZoneConnectionInfos;
	Demo;
	AccessToken;
	RefreshToken;
	IdAccount;
	Pin;
	IdLogin;
	SessionID;
	EnvironmentType;
	Options;
	SystemType;
};
P([_(50)], Le.prototype, "Login", void 0), P([_(256)], Le.prototype, "FullName", void 0), P([x()], Le.prototype, "MessageId", void 0), P([_(32)], Le.prototype, "ProtocolVersion", void 0), P([_(128)], Le.prototype, "OrderPrefix", void 0), P([T(5, 5, N.ZoneConnectionInfo)], Le.prototype, "ZoneConnectionInfos", void 0), P([O()], Le.prototype, "Demo", void 0), P([_(50)], Le.prototype, "AccessToken", void 0), P([_(50)], Le.prototype, "RefreshToken", void 0), P([x()], Le.prototype, "IdAccount", void 0), P([_(50)], Le.prototype, "Pin", void 0), P([x()], Le.prototype, "IdLogin", void 0), P([S()], Le.prototype, "SessionID", void 0), P([j(2)], Le.prototype, "EnvironmentType", void 0), P([j(8)], Le.prototype, "Options", void 0), P([j(1)], Le.prototype, "SystemType", void 0), Le = P([M(57, N.UserCredentialsEntity)], Le);
var Re = class extends F {
	Login;
	ConnectionKey;
	ProtocolVersion;
	IdDevice;
};
P([_(50)], Re.prototype, "Login", void 0), P([S()], Re.prototype, "ConnectionKey", void 0), P([_(32)], Re.prototype, "ProtocolVersion", void 0), P([_(38)], Re.prototype, "IdDevice", void 0), Re = P([M(58, N.AuthorizeWithConnectionKeyEntity)], Re);
var ze = class extends F {
	Login;
	Password;
	ClientVersion;
	DeveloperCode;
	ProtocolVersion;
	OSVersion;
	OSType;
	DeviceModel;
	MacAdress;
	IdDevice;
	ClientType;
	LocalTime;
	HomeDir;
	FilesDir;
	UserName;
	ConnectionIP;
};
P([_(50)], ze.prototype, "Login", void 0), P([_(50)], ze.prototype, "Password", void 0), P([_(30)], ze.prototype, "ClientVersion", void 0), P([_(50)], ze.prototype, "DeveloperCode", void 0), P([_(32)], ze.prototype, "ProtocolVersion", void 0), P([_(256)], ze.prototype, "OSVersion", void 0), P([j(1)], ze.prototype, "OSType", void 0), P([_(256)], ze.prototype, "DeviceModel", void 0), P([_(30)], ze.prototype, "MacAdress", void 0), P([_(38)], ze.prototype, "IdDevice", void 0), P([j(1)], ze.prototype, "ClientType", void 0), P([k()], ze.prototype, "LocalTime", void 0), P([_(256)], ze.prototype, "HomeDir", void 0), P([_(256)], ze.prototype, "FilesDir", void 0), P([_(256)], ze.prototype, "UserName", void 0), P([_(40)], ze.prototype, "ConnectionIP", void 0), ze = P([M(40, N.AuthenticationRequestEntity)], ze);
var Be = class extends F {
	Version;
	Operation;
	Id;
	DataType;
	IsDataId;
	DataId;
};
P([S()], Be.prototype, "Version", void 0), P([j(1)], Be.prototype, "Operation", void 0), P([x()], Be.prototype, "Id", void 0), P([j(2)], Be.prototype, "DataType", void 0), P([O()], Be.prototype, "IsDataId", void 0), P([w((e) => e.IsDataId ? { type: h.Int64Field } : { type: h.UnknownField })], Be.prototype, "DataId", void 0), Be = P([M(327, N.ResetDataRequestEntity)], Be);
var Ve = class extends F {
	Token;
	TokenType;
	ClientVersion;
	DeveloperCode;
	ProtocolVersion;
	OSVersion;
	OSType;
	DeviceModel;
	MacAdress;
	IdDevice;
	ClientType;
	LocalTime;
	HomeDir;
	FilesDir;
	UserName;
	ConnectionIP;
};
P([_(50)], Ve.prototype, "Token", void 0), P([j(1)], Ve.prototype, "TokenType", void 0), P([_(30)], Ve.prototype, "ClientVersion", void 0), P([_(50)], Ve.prototype, "DeveloperCode", void 0), P([_(32)], Ve.prototype, "ProtocolVersion", void 0), P([_(256)], Ve.prototype, "OSVersion", void 0), P([j(1)], Ve.prototype, "OSType", void 0), P([_(256)], Ve.prototype, "DeviceModel", void 0), P([_(30)], Ve.prototype, "MacAdress", void 0), P([_(38)], Ve.prototype, "IdDevice", void 0), P([j(1)], Ve.prototype, "ClientType", void 0), P([k()], Ve.prototype, "LocalTime", void 0), P([_(256)], Ve.prototype, "HomeDir", void 0), P([_(256)], Ve.prototype, "FilesDir", void 0), P([_(256)], Ve.prototype, "UserName", void 0), P([_(40)], Ve.prototype, "ConnectionIP", void 0), Ve = P([M(347, N.PassportAuthenticationRequestEntity)], Ve);
var U = class extends F {
	IdSubAccount;
	IdRazdel;
	IdRazdelType;
	IdDepoAccount;
	IdAccount;
	IdGate;
	IdRazdelGroup;
	CodeRazdelType;
	TradeAccount;
	ClientCode;
	CodeSubAccount;
	CodeDepoAccount;
	CorCodeRazdel;
	NameClient;
	NameDeponent;
	NameCustodian;
	NameCorCustodian;
	RCode;
	NameSubAccount;
	NameRazdelType;
	Version;
	Operation;
	IdAccessType;
	FrontID;
	IdRazdelBalance;
	IdRazdelTypeBalance;
	UniversalExchangeCode;
};
P([x()], U.prototype, "IdSubAccount", void 0), P([x()], U.prototype, "IdRazdel", void 0), P([x()], U.prototype, "IdRazdelType", void 0), P([x()], U.prototype, "IdDepoAccount", void 0), P([x()], U.prototype, "IdAccount", void 0), P([x()], U.prototype, "IdGate", void 0), P([j(4)], U.prototype, "IdRazdelGroup", void 0), P([_(18)], U.prototype, "CodeRazdelType", void 0), P([_(12)], U.prototype, "TradeAccount", void 0), P([_(16)], U.prototype, "ClientCode", void 0), P([_(14)], U.prototype, "CodeSubAccount", void 0), P([_(30)], U.prototype, "CodeDepoAccount", void 0), P([_(10)], U.prototype, "CorCodeRazdel", void 0), P([_(512)], U.prototype, "NameClient", void 0), P([_(512)], U.prototype, "NameDeponent", void 0), P([_(256)], U.prototype, "NameCustodian", void 0), P([_(256)], U.prototype, "NameCorCustodian", void 0), P([_(9)], U.prototype, "RCode", void 0), P([_(40)], U.prototype, "NameSubAccount", void 0), P([_(40)], U.prototype, "NameRazdelType", void 0), P([S()], U.prototype, "Version", void 0), P([j(1)], U.prototype, "Operation", void 0), P([j(4)], U.prototype, "IdAccessType", void 0), P([j(1)], U.prototype, "FrontID", void 0), P([x()], U.prototype, "IdRazdelBalance", void 0), P([x()], U.prototype, "IdRazdelTypeBalance", void 0), P([_(15)], U.prototype, "UniversalExchangeCode", void 0), U = P([M(63, N.SubAccountRazdelEntity)], U);
var W = class extends F {
	IdAccount;
	ClientOrderNum;
	IdSubAccount;
	IdPriceControlType;
	IdSettleCode;
	IdObject;
	IdRazdel;
	Price;
	StopPrice;
	Price2;
	SignTime;
	BuySell;
	Contragent;
	ContragentRef;
	Amount;
	MaxFloor;
	RefundRate;
	SDiscount;
	LowerDiscount;
	UpperDiscount;
	ActivationTime;
	OCOGroup;
	WithdrawTime;
	IdFIActivate;
	ActivationPriceDirection;
	Value;
	BIC;
	Comment;
	AccountContragent;
	IdAccountTypeContragent;
	Reason;
	IdCommandType;
	IdAllowedOrderParams;
	BinaryEDocument;
	IdCertificate;
	NumEDocumentBase;
	RepoDate;
	ClientNumStrategy;
};
P([x()], W.prototype, "IdAccount", void 0), P([v()], W.prototype, "ClientOrderNum", void 0), P([x()], W.prototype, "IdSubAccount", void 0), P([j(1)], W.prototype, "IdPriceControlType", void 0), P([x()], W.prototype, "IdSettleCode", void 0), P([x()], W.prototype, "IdObject", void 0), P([x()], W.prototype, "IdRazdel", void 0), P([A()], W.prototype, "Price", void 0), P([A()], W.prototype, "StopPrice", void 0), P([A()], W.prototype, "Price2", void 0), P([k()], W.prototype, "SignTime", void 0), P([j(2)], W.prototype, "BuySell", void 0), P([_(50)], W.prototype, "Contragent", void 0), P([_(100)], W.prototype, "ContragentRef", void 0), P([A()], W.prototype, "Amount", void 0), P([A()], W.prototype, "MaxFloor", void 0), P([A()], W.prototype, "RefundRate", void 0), P([A()], W.prototype, "SDiscount", void 0), P([A()], W.prototype, "LowerDiscount", void 0), P([A()], W.prototype, "UpperDiscount", void 0), P([S()], W.prototype, "ActivationTime", void 0), P([S()], W.prototype, "OCOGroup", void 0), P([S()], W.prototype, "WithdrawTime", void 0), P([x()], W.prototype, "IdFIActivate", void 0), P([j(2)], W.prototype, "ActivationPriceDirection", void 0), P([A()], W.prototype, "Value", void 0), P([_(256)], W.prototype, "BIC", void 0), P([_(256)], W.prototype, "Comment", void 0), P([_(256)], W.prototype, "AccountContragent", void 0), P([x()], W.prototype, "IdAccountTypeContragent", void 0), P([_(256)], W.prototype, "Reason", void 0), P([j(1)], W.prototype, "IdCommandType", void 0), P([x()], W.prototype, "IdAllowedOrderParams", void 0), P([ee(4096)], W.prototype, "BinaryEDocument", void 0), P([S()], W.prototype, "IdCertificate", void 0), P([S()], W.prototype, "NumEDocumentBase", void 0), P([S()], W.prototype, "RepoDate", void 0), P([x()], W.prototype, "ClientNumStrategy", void 0), W = P([M(65, N.ClientOrderEntity)], W);
var G = class extends F {
	IdOperation;
	TimeOperation;
	ExtOperNo;
	NumEDocument;
	IdObject;
	IdMarketBoard;
	IdOperationType;
	BuySell;
	Quantity;
	Price;
	Value;
	IdObjectCurrency;
	Yield;
	IdSubAccount;
	IdAccount;
	Description;
	IdOperationStatus;
	SettleDate;
	DeliveryDate;
	RepoTerm;
	RepoDate;
	IdRazdel;
	AccruedInt;
	Version;
	Operation;
	IdOperationGroup;
	IdFI;
};
P([x()], G.prototype, "IdOperation", void 0), P([k()], G.prototype, "TimeOperation", void 0), P([S()], G.prototype, "ExtOperNo", void 0), P([S()], G.prototype, "NumEDocument", void 0), P([x()], G.prototype, "IdObject", void 0), P([x()], G.prototype, "IdMarketBoard", void 0), P([j(4)], G.prototype, "IdOperationType", void 0), P([j(2)], G.prototype, "BuySell", void 0), P([A()], G.prototype, "Quantity", void 0), P([A()], G.prototype, "Price", void 0), P([A()], G.prototype, "Value", void 0), P([x()], G.prototype, "IdObjectCurrency", void 0), P([A()], G.prototype, "Yield", void 0), P([x()], G.prototype, "IdSubAccount", void 0), P([x()], G.prototype, "IdAccount", void 0), P([_(2048)], G.prototype, "Description", void 0), P([j(4)], G.prototype, "IdOperationStatus", void 0), P([k()], G.prototype, "SettleDate", void 0), P([k()], G.prototype, "DeliveryDate", void 0), P([x()], G.prototype, "RepoTerm", void 0), P([k()], G.prototype, "RepoDate", void 0), P([x()], G.prototype, "IdRazdel", void 0), P([A()], G.prototype, "AccruedInt", void 0), P([S()], G.prototype, "Version", void 0), P([j(1)], G.prototype, "Operation", void 0), P([j(4)], G.prototype, "IdOperationGroup", void 0), P([x()], G.prototype, "IdFI", void 0), G = P([M(74, N.ClientOperationEntity)], G);
var He = class extends F {
	Messages;
	CommandType;
	FlowKeys;
	DtToWait;
	SubscribeType;
};
P([j(4)], He.prototype, "Messages", void 0), P([j(1)], He.prototype, "CommandType", void 0), P([T(4, 500, "Int32Element", !0)], He.prototype, "FlowKeys", void 0), P([S()], He.prototype, "DtToWait", void 0), P([j(1)], He.prototype, "SubscribeType", void 0), He = P([M(75, N.LimitsOverflowEntity)], He);
var Ue = class extends F {
	CandleType;
	IdRequest;
	IdFI;
	TimeFrame;
	MaximumDate;
	DaysCount;
	IntervalInfo;
};
P([j(1)], Ue.prototype, "CandleType", void 0), P([x()], Ue.prototype, "IdRequest", void 0), P([x()], Ue.prototype, "IdFI", void 0), P([j(1)], Ue.prototype, "TimeFrame", void 0), P([k()], Ue.prototype, "MaximumDate", void 0), P([x()], Ue.prototype, "DaysCount", void 0), P([T(-1, 720, N.IntervalInfoEntity)], Ue.prototype, "IntervalInfo", void 0), Ue = P([M(76, N.ArchiveRequestEntity)], Ue);
var K = class extends F {
	IdOperation;
	TimeOperation;
	ExtOperNo;
	NumEDocument;
	IdObject;
	IdMarketBoard;
	IdOperationType;
	BuySell;
	Quantity;
	Price;
	Value;
	IdObjectCurrency;
	Yield;
	IdSubAccount;
	IdAccount;
	Description;
	IdOperationStatus;
	SettleDate;
	DeliveryDate;
	RepoTerm;
	RepoDate;
	IdRazdel;
	AccruedInt;
	Version;
	Operation;
};
P([x()], K.prototype, "IdOperation", void 0), P([k()], K.prototype, "TimeOperation", void 0), P([S()], K.prototype, "ExtOperNo", void 0), P([S()], K.prototype, "NumEDocument", void 0), P([x()], K.prototype, "IdObject", void 0), P([x()], K.prototype, "IdMarketBoard", void 0), P([j(4)], K.prototype, "IdOperationType", void 0), P([j(2)], K.prototype, "BuySell", void 0), P([A()], K.prototype, "Quantity", void 0), P([A()], K.prototype, "Price", void 0), P([A()], K.prototype, "Value", void 0), P([x()], K.prototype, "IdObjectCurrency", void 0), P([A()], K.prototype, "Yield", void 0), P([x()], K.prototype, "IdSubAccount", void 0), P([x()], K.prototype, "IdAccount", void 0), P([_(2048)], K.prototype, "Description", void 0), P([j(4)], K.prototype, "IdOperationStatus", void 0), P([k()], K.prototype, "SettleDate", void 0), P([k()], K.prototype, "DeliveryDate", void 0), P([x()], K.prototype, "RepoTerm", void 0), P([k()], K.prototype, "RepoDate", void 0), P([x()], K.prototype, "IdRazdel", void 0), P([A()], K.prototype, "AccruedInt", void 0), P([S()], K.prototype, "Version", void 0), P([j(1)], K.prototype, "Operation", void 0), K = P([M(77, N.BaseOperationEntity)], K);
var q = class extends F {
	IdAccount;
	IdSubAccount;
	IdObject;
	IdPosition;
	IdFIBalance;
	BackDate;
	BackUchPriceRur;
	BackPos;
	AwPriceBuy;
	AwPriceSell;
	CurRate;
	PSTNKD;
	TrnIn;
	TrnOut;
	BuyQty;
	SellQty;
	TrdPL;
	UchPriceRur;
	UchPrice;
	IdRazdel;
	MarginDiscountBuyD0;
	MarginDiscountSellD0;
	MarginDiscountBuyDX;
	MarginDiscountSellDX;
	VariationMargin;
	SessionBuyQty;
	SessionBuyVal;
	SessionSellQty;
	SessionSellVal;
	SubAccNalPos;
	Version;
	Operation;
	IdObjectOfUchPrice;
	UchPriceUSD;
	UchPriceEUR;
	UchPriceGBP;
	UchPriceCHF;
	IdFIOfUchPriceTOM;
	SymbolObject;
	UchPriceHKD;
	UchPriceCNY;
	UchPriceUSDT;
};
P([x()], q.prototype, "IdAccount", void 0), P([x()], q.prototype, "IdSubAccount", void 0), P([x()], q.prototype, "IdObject", void 0), P([x()], q.prototype, "IdPosition", void 0), P([x()], q.prototype, "IdFIBalance", void 0), P([k()], q.prototype, "BackDate", void 0), P([A()], q.prototype, "BackUchPriceRur", void 0), P([A()], q.prototype, "BackPos", void 0), P([A()], q.prototype, "AwPriceBuy", void 0), P([A()], q.prototype, "AwPriceSell", void 0), P([A()], q.prototype, "CurRate", void 0), P([A()], q.prototype, "PSTNKD", void 0), P([A()], q.prototype, "TrnIn", void 0), P([A()], q.prototype, "TrnOut", void 0), P([A()], q.prototype, "BuyQty", void 0), P([A()], q.prototype, "SellQty", void 0), P([A()], q.prototype, "TrdPL", void 0), P([A()], q.prototype, "UchPriceRur", void 0), P([A()], q.prototype, "UchPrice", void 0), P([x()], q.prototype, "IdRazdel", void 0), P([A()], q.prototype, "MarginDiscountBuyD0", void 0), P([A()], q.prototype, "MarginDiscountSellD0", void 0), P([A()], q.prototype, "MarginDiscountBuyDX", void 0), P([A()], q.prototype, "MarginDiscountSellDX", void 0), P([A()], q.prototype, "VariationMargin", void 0), P([A()], q.prototype, "SessionBuyQty", void 0), P([A()], q.prototype, "SessionBuyVal", void 0), P([A()], q.prototype, "SessionSellQty", void 0), P([A()], q.prototype, "SessionSellVal", void 0), P([A()], q.prototype, "SubAccNalPos", void 0), P([S()], q.prototype, "Version", void 0), P([j(1)], q.prototype, "Operation", void 0), P([x()], q.prototype, "IdObjectOfUchPrice", void 0), P([A()], q.prototype, "UchPriceUSD", void 0), P([A()], q.prototype, "UchPriceEUR", void 0), P([A()], q.prototype, "UchPriceGBP", void 0), P([A()], q.prototype, "UchPriceCHF", void 0), P([x()], q.prototype, "IdFIOfUchPriceTOM", void 0), P([_()], q.prototype, "SymbolObject", void 0), P([A()], q.prototype, "UchPriceHKD", void 0), P([A()], q.prototype, "UchPriceCNY", void 0), P([A()], q.prototype, "UchPriceUSDT", void 0), q = P([M(78, N.ClientSubAccPositionEntity)], q);
var We = class extends F {
	DataFlowType;
	FlowKeys;
	SubscribeType;
	Delay;
	Version;
};
P([j(2)], We.prototype, "DataFlowType", void 0), P([T(4, 500, "Int32Element", !0)], We.prototype, "FlowKeys", void 0), P([j(1)], We.prototype, "SubscribeType", void 0), P([x()], We.prototype, "Delay", void 0), P([S()], We.prototype, "Version", void 0), We = P([M(79, N.DataFlowSubscribeEntity)], We);
var Ge = class extends F {
	WTF;
	DateTime;
	OpenPrice;
	ClosePrice;
	Volumes;
	TotalVolumeAsk;
	OpenInt;
};
P([ee(4)], Ge.prototype, "WTF", void 0), P([k()], Ge.prototype, "DateTime", void 0), P([A()], Ge.prototype, "OpenPrice", void 0), P([A()], Ge.prototype, "ClosePrice", void 0), P([T(-1, -1, "VolumeForPrice")], Ge.prototype, "Volumes", void 0), P([S()], Ge.prototype, "TotalVolumeAsk", void 0), P([S()], Ge.prototype, "OpenInt", void 0), Ge = P([M(266, N.MpvDataPointEntity)], Ge);
var Ke = class extends F {
	WTF;
	DateTime;
	Open;
	High;
	Low;
	Close;
	Volume;
	OpenInt;
	VolumeAsk;
};
P([ee(4)], Ke.prototype, "WTF", void 0), P([k()], Ke.prototype, "DateTime", void 0), P([A()], Ke.prototype, "Open", void 0), P([A()], Ke.prototype, "High", void 0), P([A()], Ke.prototype, "Low", void 0), P([A()], Ke.prototype, "Close", void 0), P([S()], Ke.prototype, "Volume", void 0), P([S()], Ke.prototype, "OpenInt", void 0), P([S()], Ke.prototype, "VolumeAsk", void 0), Ke = P([M(261, N.OhlcvDataPointEntity)], Ke);
var qe = class extends F {
	WTF;
	DateTime;
	OpenPrice;
	ClosePrice;
	Volumes;
	TotalVolumeAsk;
	OpenInt;
};
P([ee(4)], qe.prototype, "WTF", void 0), P([k()], qe.prototype, "DateTime", void 0), P([A()], qe.prototype, "OpenPrice", void 0), P([A()], qe.prototype, "ClosePrice", void 0), P([T(-1, -1, "VolumeForPriceFractional")], qe.prototype, "Volumes", void 0), P([A()], qe.prototype, "TotalVolumeAsk", void 0), P([S()], qe.prototype, "OpenInt", void 0), qe = P([M(3028, N.MpvDataPointFractionalEntity)], qe);
var Je = class extends F {
	WTF;
	DateTime;
	Open;
	High;
	Low;
	Close;
	Volume;
	OpenInt;
	VolumeAsk;
};
P([ee(4)], Je.prototype, "WTF", void 0), P([k()], Je.prototype, "DateTime", void 0), P([A()], Je.prototype, "Open", void 0), P([A()], Je.prototype, "High", void 0), P([A()], Je.prototype, "Low", void 0), P([A()], Je.prototype, "Close", void 0), P([A()], Je.prototype, "Volume", void 0), P([S()], Je.prototype, "OpenInt", void 0), P([A()], Je.prototype, "VolumeAsk", void 0), Je = P([M(3027, N.OhlcvDataPointFractionalEntity)], Je);
var Ye = class extends F {
	IdRequest;
	CandleType;
	IdFI;
	TimeFrame;
	Date;
	FullDay;
	LastTradeNo;
	LastTradesCount;
	Hash;
	Candles;
};
P([x()], Ye.prototype, "IdRequest", void 0), P([j(1)], Ye.prototype, "CandleType", void 0), P([x()], Ye.prototype, "IdFI", void 0), P([j(1)], Ye.prototype, "TimeFrame", void 0), P([k()], Ye.prototype, "Date", void 0), P([O()], Ye.prototype, "FullDay", void 0), P([S()], Ye.prototype, "LastTradeNo", void 0), P([x()], Ye.prototype, "LastTradesCount", void 0), P([S()], Ye.prototype, "Hash", void 0), P([w((e) => u(-1, -1, le(e.CandleType)))], Ye.prototype, "Candles", void 0), Ye = P([M(80, N.ChartArchiveEntity)], Ye);
var Xe = class extends F {
	RequestId;
	IdAccount;
	IdRazdel;
	IdObject;
	IdMarketBoard;
	OrderType;
	DocumentType;
	BuySell;
	Price;
	QuantityType;
};
P([x()], Xe.prototype, "RequestId", void 0), P([x()], Xe.prototype, "IdAccount", void 0), P([x()], Xe.prototype, "IdRazdel", void 0), P([x()], Xe.prototype, "IdObject", void 0), P([x()], Xe.prototype, "IdMarketBoard", void 0), P([j(1)], Xe.prototype, "OrderType", void 0), P([j(1)], Xe.prototype, "DocumentType", void 0), P([j(2)], Xe.prototype, "BuySell", void 0), P([A()], Xe.prototype, "Price", void 0), P([j(1)], Xe.prototype, "QuantityType", void 0), Xe = P([M(2005, N.ClientGetTradingLimitsReq)], Xe);
var Ze = class extends F {
	RequestId;
	IdAccount;
	IdRazdel;
	IdObject;
	IdMarketBoard;
	OrderType;
	DocumentType;
	BuySell;
	Price;
	QuantityType;
	Quantity;
	QuantityForOwnAssets;
	Amount;
	FreeMoney;
	IsShortableAsset;
	AmountForOwnAssets;
	ErrorCode;
	ErrorText;
};
P([x()], Ze.prototype, "RequestId", void 0), P([x()], Ze.prototype, "IdAccount", void 0), P([x()], Ze.prototype, "IdRazdel", void 0), P([x()], Ze.prototype, "IdObject", void 0), P([x()], Ze.prototype, "IdMarketBoard", void 0), P([j(1)], Ze.prototype, "OrderType", void 0), P([j(1)], Ze.prototype, "DocumentType", void 0), P([j(2)], Ze.prototype, "BuySell", void 0), P([A()], Ze.prototype, "Price", void 0), P([j(1)], Ze.prototype, "QuantityType", void 0), P([A()], Ze.prototype, "Quantity", void 0), P([A()], Ze.prototype, "QuantityForOwnAssets", void 0), P([A()], Ze.prototype, "Amount", void 0), P([A()], Ze.prototype, "FreeMoney", void 0), P([O()], Ze.prototype, "IsShortableAsset", void 0), P([A()], Ze.prototype, "AmountForOwnAssets", void 0), P([j(4)], Ze.prototype, "ErrorCode", void 0), P([_(255)], Ze.prototype, "ErrorText", void 0), Ze = P([M(2006, N.ClientGetTradingLimitsRsp)], Ze);
var Qe = class extends F {
	IdLogin;
	IdCertificate;
	State;
	Type;
	Alias;
	Description;
	Certificate;
	IdDevice;
	Version;
	Operation;
	FirstDateCert;
	LastDateCert;
};
P([x()], Qe.prototype, "IdLogin", void 0), P([S()], Qe.prototype, "IdCertificate", void 0), P([j(1)], Qe.prototype, "State", void 0), P([j(1)], Qe.prototype, "Type", void 0), P([_()], Qe.prototype, "Alias", void 0), P([_()], Qe.prototype, "Description", void 0), P([D()], Qe.prototype, "Certificate", void 0), P([_()], Qe.prototype, "IdDevice", void 0), P([S()], Qe.prototype, "Version", void 0), P([j(1)], Qe.prototype, "Operation", void 0), P([k()], Qe.prototype, "FirstDateCert", void 0), P([k()], Qe.prototype, "LastDateCert", void 0), Qe = P([M(86, N.ClientCertificateEntity)], Qe);
var $e = class extends F {
	Command;
	Id;
};
P([b()], $e.prototype, "Command", void 0), P([x()], $e.prototype, "Id", void 0), $e = P([M(87, N.InitFinishedEntity)], $e);
var et = class extends F {
	CandleType;
	IdFI;
	TimeFrame;
	Open;
	High;
	Low;
	Close;
	Volume;
	OpenInt;
	Time;
	VolAsk;
	IdCandle;
};
P([j(1)], et.prototype, "CandleType", void 0), P([x()], et.prototype, "IdFI", void 0), P([j(1)], et.prototype, "TimeFrame", void 0), P([A()], et.prototype, "Open", void 0), P([A()], et.prototype, "High", void 0), P([A()], et.prototype, "Low", void 0), P([A()], et.prototype, "Close", void 0), P([S()], et.prototype, "Volume", void 0), P([S()], et.prototype, "OpenInt", void 0), P([k()], et.prototype, "Time", void 0), P([S()], et.prototype, "VolAsk", void 0), P([x()], et.prototype, "IdCandle", void 0), et = P([M(135, N.CandleStandardDbEntity)], et);
var tt = class extends F {
	ProtocolVersion;
	Messages;
};
P([_(32)], tt.prototype, "ProtocolVersion", void 0), P([T(-1, 500, "ADMessage")], tt.prototype, "Messages", void 0), tt = P([M(267, N.ProtocolInfoEntity)], tt);
var nt = class extends F {
	IdRequest;
	IdAccount;
	CertificateRequest;
	Alias;
	Description;
};
P([x()], nt.prototype, "IdRequest", void 0), P([x()], nt.prototype, "IdAccount", void 0), P([D()], nt.prototype, "CertificateRequest", void 0), P([_()], nt.prototype, "Alias", void 0), P([_()], nt.prototype, "Description", void 0), nt = P([M(354, N.CertificateRequestEntity)], nt);
var rt = class extends F {
	IdRequest;
	Certificate;
};
P([x()], rt.prototype, "IdRequest", void 0), P([D()], rt.prototype, "Certificate", void 0), rt = P([M(355, N.CertificateResponseEntity)], rt);
var it = class extends F {
	IdAccount;
	IdRequest;
	ClientOrderNum;
	IdCertificate;
	Action;
};
P([x()], it.prototype, "IdAccount", void 0), P([x()], it.prototype, "IdRequest", void 0), P([v()], it.prototype, "ClientOrderNum", void 0), P([S()], it.prototype, "IdCertificate", void 0), P([j(1)], it.prototype, "Action", void 0), it = P([M(356, N.RequestForCertificateActionSMSEntity)], it);
var at = class extends F {
	IdRequest;
	Referece;
	ErrorCode;
	ErrorText;
	OrderTextTemplate;
	SignTime;
};
P([x()], at.prototype, "IdRequest", void 0), P([_()], at.prototype, "Referece", void 0), P([j(4)], at.prototype, "ErrorCode", void 0), P([_()], at.prototype, "ErrorText", void 0), P([D()], at.prototype, "OrderTextTemplate", void 0), P([k()], at.prototype, "SignTime", void 0), at = P([M(357, N.ResponseForCertificateActionSMSEntity)], at);
var ot = class extends F {
	IdAccount;
	ClientOrderNum;
	BinaryEDocument;
	IdCertificate;
	SignTime;
	Reference;
	SMSCode;
	Action;
};
P([x()], ot.prototype, "IdAccount", void 0), P([v()], ot.prototype, "ClientOrderNum", void 0), P([D()], ot.prototype, "BinaryEDocument", void 0), P([S()], ot.prototype, "IdCertificate", void 0), P([k()], ot.prototype, "SignTime", void 0), P([_(20)], ot.prototype, "Reference", void 0), P([_(16)], ot.prototype, "SMSCode", void 0), P([j(1)], ot.prototype, "Action", void 0), ot = P([M(358, N.RequestForCertificateActionWithSMSEntity)], ot);
var st = class extends F {
	ClientOrderNum;
	ClientNumEDocument;
	ErrorCode;
	ErrorText;
};
P([x()], st.prototype, "ClientOrderNum", void 0), P([_(128)], st.prototype, "ClientNumEDocument", void 0), P([j(4)], st.prototype, "ErrorCode", void 0), P([_(1024)], st.prototype, "ErrorText", void 0), st = P([M(359, N.ResponseForCertificateActionWithSMSEntity)], st);
var ct = class extends F {
	CandleType;
	IdRequest;
	IdFI;
	TimeFrame;
	MaximumDate;
	DaysCount;
	IntervalInfo;
};
P([j(1)], ct.prototype, "CandleType", void 0), P([x()], ct.prototype, "IdRequest", void 0), P([x()], ct.prototype, "IdFI", void 0), P([j(1)], ct.prototype, "TimeFrame", void 0), P([k()], ct.prototype, "MaximumDate", void 0), P([x()], ct.prototype, "DaysCount", void 0), P([T(-1, 720, N.IntervalInfoEntity)], ct.prototype, "IntervalInfo", void 0), ct = P([M(542, N.ArchiveRequest3Entity)], ct);
var lt = class extends F {
	IdRequest;
	RequestReceiveTime;
	StartReplyTime;
};
P([x()], lt.prototype, "IdRequest", void 0), P([k()], lt.prototype, "RequestReceiveTime", void 0), P([k()], lt.prototype, "StartReplyTime", void 0), lt = P([M(544, N.ChartSequenceBegin)], lt);
var ut = class extends F {
	Type;
	Value;
};
P([j(1)], ut.prototype, "Type", void 0), P([C()], ut.prototype, "Value", void 0), ut = P([M(-12, N.TopVolumeInstrumetsRequestFilter)], ut);
var dt = class extends F {
	RequestId;
	ObjectGroup;
	NamePattern;
	NumberOfInstruments;
	Offset;
	SortingType;
	Filters;
};
P([x()], dt.prototype, "RequestId", void 0), P([j(4)], dt.prototype, "ObjectGroup", void 0), P([_(256)], dt.prototype, "NamePattern", void 0), P([b()], dt.prototype, "NumberOfInstruments", void 0), P([x()], dt.prototype, "Offset", void 0), P([j(1)], dt.prototype, "SortingType", void 0), P([T(-1, 10, N.TopVolumeInstrumetsRequestFilter)], dt.prototype, "Filters", void 0), dt = P([M(263, N.TopVolumeInstrumetsRequestEntity)], dt);
var ft = class extends F {
	RequestId;
	Instruments;
	RemainingInstruments;
};
P([x()], ft.prototype, "RequestId", void 0), P([T(-1, 16e3, N.Int32Element, !0)], ft.prototype, "Instruments", void 0), P([x()], ft.prototype, "RemainingInstruments", void 0), ft = P([M(264, N.TopVolumeInstrumetsResponseEntity)], ft);
var pt = class extends F {
	MetricTime;
	IdService;
	IdSession;
	TerminalType;
	IdMetric;
	IdItem;
	Count;
	Value;
	ExValue;
	ExValue2;
};
P([x()], pt.prototype, "MetricTime", void 0), P([b()], pt.prototype, "IdService", void 0), P([S()], pt.prototype, "IdSession", void 0), P([j(1)], pt.prototype, "TerminalType", void 0), P([b()], pt.prototype, "IdMetric", void 0), P([b()], pt.prototype, "IdItem", void 0), P([x()], pt.prototype, "Count", void 0), P([S()], pt.prototype, "Value", void 0), P([S()], pt.prototype, "ExValue", void 0), P([S()], pt.prototype, "ExValue2", void 0), pt = P([M(547, N.MetricEntity)], pt);
var J = class extends F {
	IdAccount;
	IdSubAccount;
	IdRazdel;
	BuySell;
	Price;
	StopPrice;
	Amount;
	MaxFloor;
	Price2;
	Value;
	IdObject;
	IdAllowedOrderParams;
	IdSettleCode;
	PriceControlType;
	NumEDocumentBase;
	ClientOrderNum;
	ClientNumStrategy;
	OrderChannel;
	IdCertificate;
	SignTime;
	SignType;
	ActivationTime;
	IdFIActivate;
	ActivationPriceDirection;
	WithdrawTime;
	Flags;
	ExtDocId;
	Contragent;
	ContragentRef;
	Comment;
	BinaryEDocument;
};
P([x()], J.prototype, "IdAccount", void 0), P([x()], J.prototype, "IdSubAccount", void 0), P([x()], J.prototype, "IdRazdel", void 0), P([j(2)], J.prototype, "BuySell", void 0), P([A()], J.prototype, "Price", void 0), P([A()], J.prototype, "StopPrice", void 0), P([A()], J.prototype, "Amount", void 0), P([A()], J.prototype, "MaxFloor", void 0), P([A()], J.prototype, "Price2", void 0), P([A()], J.prototype, "Value", void 0), P([x()], J.prototype, "IdObject", void 0), P([x()], J.prototype, "IdAllowedOrderParams", void 0), P([x()], J.prototype, "IdSettleCode", void 0), P([j(1)], J.prototype, "PriceControlType", void 0), P([S()], J.prototype, "NumEDocumentBase", void 0), P([v()], J.prototype, "ClientOrderNum", void 0), P([x()], J.prototype, "ClientNumStrategy", void 0), P([j(4)], J.prototype, "OrderChannel", void 0), P([S()], J.prototype, "IdCertificate", void 0), P([k()], J.prototype, "SignTime", void 0), P([j(1)], J.prototype, "SignType", void 0), P([k()], J.prototype, "ActivationTime", void 0), P([x()], J.prototype, "IdFIActivate", void 0), P([j(2)], J.prototype, "ActivationPriceDirection", void 0), P([k()], J.prototype, "WithdrawTime", void 0), P([j(4)], J.prototype, "Flags", void 0), P([S()], J.prototype, "ExtDocId", void 0), P([_(50)], J.prototype, "Contragent", void 0), P([_(100)], J.prototype, "ContragentRef", void 0), P([_()], J.prototype, "Comment", void 0), P([D()], J.prototype, "BinaryEDocument", void 0), J = P([M(705, N.ClientEnterOrderExReq)], J);
var mt = class extends F {
	IdAccount;
	IdSubAccount;
	IdRazdel;
	NumEDocumentBase;
	ClientOrderNum;
	ClientNumStrategy;
	OrderChannel;
	IdCertificate;
	SignTime;
	SignType;
	Flags;
	BinaryEDocument;
};
P([x()], mt.prototype, "IdAccount", void 0), P([x()], mt.prototype, "IdSubAccount", void 0), P([x()], mt.prototype, "IdRazdel", void 0), P([S()], mt.prototype, "NumEDocumentBase", void 0), P([v()], mt.prototype, "ClientOrderNum", void 0), P([x()], mt.prototype, "ClientNumStrategy", void 0), P([j(4)], mt.prototype, "OrderChannel", void 0), P([S()], mt.prototype, "IdCertificate", void 0), P([k()], mt.prototype, "SignTime", void 0), P([j(1)], mt.prototype, "SignType", void 0), P([j(4)], mt.prototype, "Flags", void 0), P([D()], mt.prototype, "BinaryEDocument", void 0), mt = P([M(707, N.ClientCancelOrderExReq)], mt);
var ht = class extends F {
	ClientOrderNum;
	ClientNumStrategy;
	NumEDocument;
	ErrorCode;
	ErrorText;
};
P([v()], ht.prototype, "ClientOrderNum", void 0), P([x()], ht.prototype, "ClientNumStrategy", void 0), P([S()], ht.prototype, "NumEDocument", void 0), P([j(4)], ht.prototype, "ErrorCode", void 0), P([_()], ht.prototype, "ErrorText", void 0), ht = P([M(706, N.ClientEnterOrderExRsp)], ht);
var gt = class extends F {
	ClientOrderNum;
	ClientNumStrategy;
	NumEDocument;
	ErrorCode;
	ErrorText;
};
P([v()], gt.prototype, "ClientOrderNum", void 0), P([x()], gt.prototype, "ClientNumStrategy", void 0), P([S()], gt.prototype, "NumEDocument", void 0), P([j(4)], gt.prototype, "ErrorCode", void 0), P([_()], gt.prototype, "ErrorText", void 0), gt = P([M(708, N.ClientCancelOrderExRsp)], gt);
var _t = class extends F {
	IdRequest;
};
P([x()], _t.prototype, "IdRequest", void 0), _t = P([M(545, N.ChartSequenceEnd)], _t);
var vt = class extends F {
	IdObject;
	IdFIBalance;
	IdMarketBoardBalance;
	AccruedIntT0;
	Version;
	Operation;
};
P([x()], vt.prototype, "IdObject", void 0), P([x()], vt.prototype, "IdFIBalance", void 0), P([x()], vt.prototype, "IdMarketBoardBalance", void 0), P([A()], vt.prototype, "AccruedIntT0", void 0), P([S()], vt.prototype, "Version", void 0), P([j(1)], vt.prototype, "Operation", void 0), vt = P([M(395, N.ObjectExtEntity)], vt);
var yt = class extends F {
	IdTrackPrice;
	IdType;
	IdState;
	IdFI;
	IdDevice;
	InitialPrice;
	TargetPrice;
	ExpirationDate;
	Version;
	Operation;
	LastUpdate;
	TrackNum;
	SymbolSpec;
	Caption;
	Text;
};
P([S()], yt.prototype, "IdTrackPrice", void 0), P([j(1)], yt.prototype, "IdType", void 0), P([j(1)], yt.prototype, "IdState", void 0), P([x()], yt.prototype, "IdFI", void 0), P([_(38)], yt.prototype, "IdDevice", void 0), P([A()], yt.prototype, "InitialPrice", void 0), P([A()], yt.prototype, "TargetPrice", void 0), P([k()], yt.prototype, "ExpirationDate", void 0), P([S()], yt.prototype, "Version", void 0), P([j(1)], yt.prototype, "Operation", void 0), P([k()], yt.prototype, "LastUpdate", void 0), P([S()], yt.prototype, "TrackNum", void 0), P([_(280)], yt.prototype, "SymbolSpec", void 0), P([_(80)], yt.prototype, "Caption", void 0), P([_(256)], yt.prototype, "Text", void 0), yt = P([M(367, N.TrackPriceEntity)], yt);
var bt = class extends F {
	IdRequest;
	IdDevice;
	Token;
	Action;
	DeviceAddressMFM;
};
P([x()], bt.prototype, "IdRequest", void 0), P([_(38)], bt.prototype, "IdDevice", void 0), P([_(4096)], bt.prototype, "Token", void 0), P([j(1)], bt.prototype, "Action", void 0), P([_(100)], bt.prototype, "DeviceAddressMFM", void 0), bt = P([M(345, N.NotificationSubscriptionEntity)], bt);
var xt = class extends F {
	IdSubscription;
	IdNotification;
	IdDevice;
	IdState;
	Version;
	Operation;
};
P([x()], xt.prototype, "IdSubscription", void 0), P([j(4)], xt.prototype, "IdNotification", void 0), P([_(38)], xt.prototype, "IdDevice", void 0), P([j(1)], xt.prototype, "IdState", void 0), P([S()], xt.prototype, "Version", void 0), P([j(1)], xt.prototype, "Operation", void 0), xt = P([M(348, N.NotificationSubscriptionStateEntity)], xt);
var Y = class extends F {
	IdAccount;
	MargKoef;
	IdTarif;
	TaxRate;
	BackTaxSaldo;
	IdScheme;
	AdmRezerv;
	QLevel;
	AccAdSyncBal;
	IdMarginAccountGroup;
	IdMarginPaperGroup;
	Version;
	Operation;
	NomarketTax;
	TradeTax;
	RPSTax;
	AccAllowLevel;
	SpbexOrdersBalanceLimit;
	NameTariffPlan;
	IIAType;
	SPBEX_FeeRate;
	SELT_FeeRate;
	SELT_ExecFeeRate;
	SPBEX_OneCentFeeFlag;
	EFR;
	OpeningPositionDisabled;
	MicroInvest;
	AccountTestLevel;
	IdClient;
	Options;
	ClosingIIAOrderSubmitted;
};
P([x()], Y.prototype, "IdAccount", void 0), P([A()], Y.prototype, "MargKoef", void 0), P([x()], Y.prototype, "IdTarif", void 0), P([A()], Y.prototype, "TaxRate", void 0), P([A()], Y.prototype, "BackTaxSaldo", void 0), P([x()], Y.prototype, "IdScheme", void 0), P([A()], Y.prototype, "AdmRezerv", void 0), P([x()], Y.prototype, "QLevel", void 0), P([A()], Y.prototype, "AccAdSyncBal", void 0), P([x()], Y.prototype, "IdMarginAccountGroup", void 0), P([x()], Y.prototype, "IdMarginPaperGroup", void 0), P([S()], Y.prototype, "Version", void 0), P([j(1)], Y.prototype, "Operation", void 0), P([A()], Y.prototype, "NomarketTax", void 0), P([A()], Y.prototype, "TradeTax", void 0), P([A()], Y.prototype, "RPSTax", void 0), P([x()], Y.prototype, "AccAllowLevel", void 0), P([x()], Y.prototype, "SpbexOrdersBalanceLimit", void 0), P([_(50)], Y.prototype, "NameTariffPlan", void 0), P([j(1)], Y.prototype, "IIAType", void 0), P([A()], Y.prototype, "SPBEX_FeeRate", void 0), P([A()], Y.prototype, "SELT_FeeRate", void 0), P([A()], Y.prototype, "SELT_ExecFeeRate", void 0), P([O()], Y.prototype, "SPBEX_OneCentFeeFlag", void 0), P([O()], Y.prototype, "EFR", void 0), P([O()], Y.prototype, "OpeningPositionDisabled", void 0), P([O()], Y.prototype, "MicroInvest", void 0), P([j(4)], Y.prototype, "AccountTestLevel", void 0), P([x()], Y.prototype, "IdClient", void 0), P([j(8)], Y.prototype, "Options", void 0), P([O()], Y.prototype, "ClosingIIAOrderSubmitted", void 0), Y = P([M(142, N.TSAccount4LSEntity)], Y);
var St = class extends F {
	IdAccount;
	IdRazdel;
	IdObject;
	IdMarketBoard;
	IdDocumentType;
	BuySell;
	Price;
	IdOrderType;
	Quantity;
	IdRequest;
	IdQuantityType;
	Amount;
};
P([x()], St.prototype, "IdAccount", void 0), P([x()], St.prototype, "IdRazdel", void 0), P([x()], St.prototype, "IdObject", void 0), P([x()], St.prototype, "IdMarketBoard", void 0), P([j(1)], St.prototype, "IdDocumentType", void 0), P([j(2)], St.prototype, "BuySell", void 0), P([A()], St.prototype, "Price", void 0), P([j(1)], St.prototype, "IdOrderType", void 0), P([x()], St.prototype, "Quantity", void 0), P([x()], St.prototype, "IdRequest", void 0), P([j(1)], St.prototype, "IdQuantityType", void 0), P([A()], St.prototype, "Amount", void 0), St = P([M(416, N.TradeShortNoticeRequest)], St);
var Ct = class extends F {
	IdObject;
	SymbolObject;
	Fee;
	Borrowed;
	Own;
};
P([x()], Ct.prototype, "IdObject", void 0), P([_(18)], Ct.prototype, "SymbolObject", void 0), P([A()], Ct.prototype, "Fee", void 0), P([A()], Ct.prototype, "Borrowed", void 0), P([A()], Ct.prototype, "Own", void 0), Ct = P([M(-10, N.TradeShortNoticeObject)], Ct);
var wt = class extends F {
	IdAccount;
	IdRazdel;
	IdObject;
	IdMarketBoard;
	IdDocumentType;
	BuySell;
	Price;
	IdOrderType;
	Quantity;
	IdRequest;
	IsShort;
	Objects;
	ErrorCode;
	ErrorText;
};
P([x()], wt.prototype, "IdAccount", void 0), P([x()], wt.prototype, "IdRazdel", void 0), P([x()], wt.prototype, "IdObject", void 0), P([x()], wt.prototype, "IdMarketBoard", void 0), P([j(1)], wt.prototype, "IdDocumentType", void 0), P([j(2)], wt.prototype, "BuySell", void 0), P([A()], wt.prototype, "Price", void 0), P([j(1)], wt.prototype, "IdOrderType", void 0), P([x()], wt.prototype, "Quantity", void 0), P([x()], wt.prototype, "IdRequest", void 0), P([O()], wt.prototype, "IsShort", void 0), P([T(-1, 5, N.TradeShortNoticeObject)], wt.prototype, "Objects", void 0), P([j(4)], wt.prototype, "ErrorCode", void 0), P([_()], wt.prototype, "ErrorText", void 0), wt = P([M(417, N.TradeShortNoticeResponse)], wt);
var Tt = class extends F {
	IdMoneyAccount;
	IdAccount;
	IdObjectCurrency;
	MoneyAccount;
	IdRazdelGroup;
	MoneyAccountName;
	Version;
	Operation;
};
P([x()], Tt.prototype, "IdMoneyAccount", void 0), P([x()], Tt.prototype, "IdAccount", void 0), P([x()], Tt.prototype, "IdObjectCurrency", void 0), P([_()], Tt.prototype, "MoneyAccount", void 0), P([j(4)], Tt.prototype, "IdRazdelGroup", void 0), P([_()], Tt.prototype, "MoneyAccountName", void 0), P([S()], Tt.prototype, "Version", void 0), P([j(1)], Tt.prototype, "Operation", void 0), Tt = P([M(306, N.ClientMoneyAccountEntity)], Tt);
var Et = class extends F {
	RequestId;
	IdAccount;
	IdRazdel;
	IdObject;
	IdMarketBoard;
	BuySell;
};
P([x()], Et.prototype, "RequestId", void 0), P([x()], Et.prototype, "IdAccount", void 0), P([x()], Et.prototype, "IdRazdel", void 0), P([x()], Et.prototype, "IdObject", void 0), P([x()], Et.prototype, "IdMarketBoard", void 0), P([j(2)], Et.prototype, "BuySell", void 0), Et = P([M(703, N.ClientGetMarketOrderValueReq)], Et);
var Dt = class extends F {
	RequestId;
	Value;
	Lot;
	ErrorCode;
	ErrorText;
};
P([x()], Dt.prototype, "RequestId", void 0), P([A()], Dt.prototype, "Value", void 0), P([x()], Dt.prototype, "Lot", void 0), P([j(4)], Dt.prototype, "ErrorCode", void 0), P([_()], Dt.prototype, "ErrorText", void 0), Dt = P([M(704, N.ClientGetMarketOrderValueRsp)], Dt);
var Ot = class extends F {
	IdAccount;
	IdSubAccount;
	IdRazdel;
	IdObjectCurrency;
	Amount;
	Channel;
	NumEDocument;
	IdOrderStatus;
	OrderStatusRevision;
	ExtOrderNum;
	SymbolObject;
	Rest;
	OrderUpdateTime;
	AcceptTime;
	BrokerErrorCode;
	BrokerComment;
	CryptoNetwork;
	WebViewRef;
	Operation;
};
P([x()], Ot.prototype, "IdAccount", void 0), P([x()], Ot.prototype, "IdSubAccount", void 0), P([x()], Ot.prototype, "IdRazdel", void 0), P([x()], Ot.prototype, "IdObjectCurrency", void 0), P([A()], Ot.prototype, "Amount", void 0), P([j(4)], Ot.prototype, "Channel", void 0), P([S()], Ot.prototype, "NumEDocument", void 0), P([j(4)], Ot.prototype, "IdOrderStatus", void 0), P([x()], Ot.prototype, "OrderStatusRevision", void 0), P([S()], Ot.prototype, "ExtOrderNum", void 0), P([_(18)], Ot.prototype, "SymbolObject", void 0), P([A()], Ot.prototype, "Rest", void 0), P([S()], Ot.prototype, "OrderUpdateTime", void 0), P([k()], Ot.prototype, "AcceptTime", void 0), P([j(4)], Ot.prototype, "BrokerErrorCode", void 0), P([_(400)], Ot.prototype, "BrokerComment", void 0), P([_(21)], Ot.prototype, "CryptoNetwork", void 0), P([_(255)], Ot.prototype, "WebViewRef", void 0), P([j(1)], Ot.prototype, "Operation", void 0), Ot = P([M(723, N.WithdrawPartnerAssetOrder)], Ot);
var kt = class extends F {
	idRequest;
	idFiList;
};
P([x()], kt.prototype, "idRequest", void 0), P([T(-1, 50, "Int32Element", !0)], kt.prototype, "idFiList", void 0), kt = P([M(616, N.ClientGetInstrumentInfoExtReq)], kt);
var At = class extends F {
	idRequest;
};
P([x()], At.prototype, "idRequest", void 0), At = P([M(617, N.ClientGetInstrumentInfoExtRsp)], At);
var jt = class extends F {
	assetId;
	boardId;
};
P([_()], jt.prototype, "assetId", void 0), P([_()], jt.prototype, "boardId", void 0), jt = P([M(-11, N.UniversalCodesInfo)], jt);
var Mt = class extends F {
	idRequest;
	universalCodesList;
};
P([x()], Mt.prototype, "idRequest", void 0), P([T(-1, 50, N.UniversalCodesInfo)], Mt.prototype, "universalCodesList", void 0), Mt = P([M(618, N.ClientGetInstrumentInfoByUniversalCodesExtReq)], Mt);
var Nt = class extends F {
	idRequest;
};
P([x()], Nt.prototype, "idRequest", void 0), Nt = P([M(619, N.ClientGetInstrumentInfoByUniversalCodesExtRsp)], Nt);
var X = class extends F {
	id;
	idMarketBoard;
	nameMarketBoard;
	currancyTOMIdFi;
	currancyCBIdFi;
	Rcode;
	universalMarketCode;
	type;
	idObject;
	idObjectGroup;
	issuerObject;
	symbolObject;
	ISIN;
	nameObject;
	descObject;
	nominal;
	nominalCurrancyTOMIdFi;
	nominalCurrancyCBIdFi;
	matDateObject;
	expired;
	idRequest;
	options;
	legalMarketName;
};
P([x()], X.prototype, "id", void 0), P([x()], X.prototype, "idMarketBoard", void 0), P([_()], X.prototype, "nameMarketBoard", void 0), P([x()], X.prototype, "currancyTOMIdFi", void 0), P([x()], X.prototype, "currancyCBIdFi", void 0), P([_()], X.prototype, "Rcode", void 0), P([_()], X.prototype, "universalMarketCode", void 0), P([S()], X.prototype, "type", void 0), P([x()], X.prototype, "idObject", void 0), P([j(4)], X.prototype, "idObjectGroup", void 0), P([x()], X.prototype, "issuerObject", void 0), P([_()], X.prototype, "symbolObject", void 0), P([_()], X.prototype, "ISIN", void 0), P([_()], X.prototype, "nameObject", void 0), P([_()], X.prototype, "descObject", void 0), P([A()], X.prototype, "nominal", void 0), P([x()], X.prototype, "nominalCurrancyTOMIdFi", void 0), P([x()], X.prototype, "nominalCurrancyCBIdFi", void 0), P([k()], X.prototype, "matDateObject", void 0), P([b()], X.prototype, "expired", void 0), P([x()], X.prototype, "idRequest", void 0), P([x()], X.prototype, "options", void 0), P([_()], X.prototype, "legalMarketName", void 0), X = P([ie(620, N.InstrumentInfoExtEntity)], X);
//#endregion
//#region packages/core/src/lib/client/serialization/ExtendedDataView/ExtendedDataView.ts
var Pt = class extends DataView {
	getUint24(e) {
		return (this.getUint8(e + 2) << 16) + (this.getUint8(e + 1) << 8) + this.getUint8(e);
	}
	setUint24(e, t) {
		this.setUint8(e + 2, (t & 16711680) >>> 16), this.setUint8(e + 1, (t & 65280) >>> 8), this.setUint8(e + 0, t & 255);
	}
	setBigInt64(e, t, n) {
		if (super.setBigInt64) super.setBigInt64(e, t, n);
		else {
			let r = t >> 32n & 4294967295n, i = t & 4294967295n, [a, o] = n ? [4, 0] : [0, 4];
			this.setUint32(e + a, Number(r), n), this.setUint32(e + o, Number(i), n);
		}
	}
	getBigInt64(e, t) {
		if (super.getBigInt64) return super.getBigInt64(e, t);
		{
			let [n, r] = t ? [4, 0] : [0, 4], i = BigInt(this.getUint32(e + n, t)), a = BigInt(this.getUint32(e + r, t));
			return (i << BigInt(32)) + a;
		}
	}
}, Ft = 4, It = 0, Lt = 1, Rt = 2;
function zt(e) {
	let t = e.length;
	for (; --t >= 0;) e[t] = 0;
}
var Bt = 29, Vt = 256, Ht = 286, Ut = 30, Wt = 19, Gt = 573, Kt = 15, qt = 16, Jt = 7, Yt = 256, Xt = 16, Zt = 17, Qt = 18, $t = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	2,
	2,
	2,
	2,
	3,
	3,
	3,
	3,
	4,
	4,
	4,
	4,
	5,
	5,
	5,
	5,
	0
]), en = new Uint8Array([
	0,
	0,
	0,
	0,
	1,
	1,
	2,
	2,
	3,
	3,
	4,
	4,
	5,
	5,
	6,
	6,
	7,
	7,
	8,
	8,
	9,
	9,
	10,
	10,
	11,
	11,
	12,
	12,
	13,
	13
]), tn = new Uint8Array([
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	2,
	3,
	7
]), nn = new Uint8Array([
	16,
	17,
	18,
	0,
	8,
	7,
	9,
	6,
	10,
	5,
	11,
	4,
	12,
	3,
	13,
	2,
	14,
	1,
	15
]), rn = 512, an = Array(576);
zt(an);
var on = Array(60);
zt(on);
var sn = Array(rn);
zt(sn);
var cn = Array(256);
zt(cn);
var ln = Array(Bt);
zt(ln);
var un = Array(Ut);
zt(un);
function dn(e, t, n, r, i) {
	this.static_tree = e, this.extra_bits = t, this.extra_base = n, this.elems = r, this.max_length = i, this.has_stree = e && e.length;
}
var fn, pn, mn;
function hn(e, t) {
	this.dyn_tree = e, this.max_code = 0, this.stat_desc = t;
}
var gn = (e) => e < 256 ? sn[e] : sn[256 + (e >>> 7)], _n = (e, t) => {
	e.pending_buf[e.pending++] = t & 255, e.pending_buf[e.pending++] = t >>> 8 & 255;
}, vn = (e, t, n) => {
	e.bi_valid > qt - n ? (e.bi_buf |= t << e.bi_valid & 65535, _n(e, e.bi_buf), e.bi_buf = t >> qt - e.bi_valid, e.bi_valid += n - qt) : (e.bi_buf |= t << e.bi_valid & 65535, e.bi_valid += n);
}, yn = (e, t, n) => {
	vn(e, n[t * 2], n[t * 2 + 1]);
}, bn = (e, t) => {
	let n = 0;
	do
		n |= e & 1, e >>>= 1, n <<= 1;
	while (--t > 0);
	return n >>> 1;
}, xn = (e) => {
	e.bi_valid === 16 ? (_n(e, e.bi_buf), e.bi_buf = 0, e.bi_valid = 0) : e.bi_valid >= 8 && (e.pending_buf[e.pending++] = e.bi_buf & 255, e.bi_buf >>= 8, e.bi_valid -= 8);
}, Sn = (e, t) => {
	let n = t.dyn_tree, r = t.max_code, i = t.stat_desc.static_tree, a = t.stat_desc.has_stree, o = t.stat_desc.extra_bits, s = t.stat_desc.extra_base, c = t.stat_desc.max_length, l, u, d, f, p, m, h = 0;
	for (f = 0; f <= Kt; f++) e.bl_count[f] = 0;
	for (n[e.heap[e.heap_max] * 2 + 1] = 0, l = e.heap_max + 1; l < Gt; l++) u = e.heap[l], f = n[n[u * 2 + 1] * 2 + 1] + 1, f > c && (f = c, h++), n[u * 2 + 1] = f, !(u > r) && (e.bl_count[f]++, p = 0, u >= s && (p = o[u - s]), m = n[u * 2], e.opt_len += m * (f + p), a && (e.static_len += m * (i[u * 2 + 1] + p)));
	if (h !== 0) {
		do {
			for (f = c - 1; e.bl_count[f] === 0;) f--;
			e.bl_count[f]--, e.bl_count[f + 1] += 2, e.bl_count[c]--, h -= 2;
		} while (h > 0);
		for (f = c; f !== 0; f--) for (u = e.bl_count[f]; u !== 0;) d = e.heap[--l], !(d > r) && (n[d * 2 + 1] !== f && (e.opt_len += (f - n[d * 2 + 1]) * n[d * 2], n[d * 2 + 1] = f), u--);
	}
}, Cn = (e, t, n) => {
	let r = Array(16), i = 0, a, o;
	for (a = 1; a <= Kt; a++) r[a] = i = i + n[a - 1] << 1;
	for (o = 0; o <= t; o++) {
		let t = e[o * 2 + 1];
		t !== 0 && (e[o * 2] = bn(r[t]++, t));
	}
}, wn = () => {
	let e, t, n, r, i, a = Array(16);
	for (n = 0, r = 0; r < 28; r++) for (ln[r] = n, e = 0; e < 1 << $t[r]; e++) cn[n++] = r;
	for (cn[n - 1] = r, i = 0, r = 0; r < 16; r++) for (un[r] = i, e = 0; e < 1 << en[r]; e++) sn[i++] = r;
	for (i >>= 7; r < Ut; r++) for (un[r] = i << 7, e = 0; e < 1 << en[r] - 7; e++) sn[256 + i++] = r;
	for (t = 0; t <= Kt; t++) a[t] = 0;
	for (e = 0; e <= 143;) an[e * 2 + 1] = 8, e++, a[8]++;
	for (; e <= 255;) an[e * 2 + 1] = 9, e++, a[9]++;
	for (; e <= 279;) an[e * 2 + 1] = 7, e++, a[7]++;
	for (; e <= 287;) an[e * 2 + 1] = 8, e++, a[8]++;
	for (Cn(an, 287, a), e = 0; e < Ut; e++) on[e * 2 + 1] = 5, on[e * 2] = bn(e, 5);
	fn = new dn(an, $t, 257, Ht, Kt), pn = new dn(on, en, 0, Ut, Kt), mn = new dn([], tn, 0, Wt, Jt);
}, Tn = (e) => {
	let t;
	for (t = 0; t < Ht; t++) e.dyn_ltree[t * 2] = 0;
	for (t = 0; t < Ut; t++) e.dyn_dtree[t * 2] = 0;
	for (t = 0; t < Wt; t++) e.bl_tree[t * 2] = 0;
	e.dyn_ltree[Yt * 2] = 1, e.opt_len = e.static_len = 0, e.last_lit = e.matches = 0;
}, En = (e) => {
	e.bi_valid > 8 ? _n(e, e.bi_buf) : e.bi_valid > 0 && (e.pending_buf[e.pending++] = e.bi_buf), e.bi_buf = 0, e.bi_valid = 0;
}, Dn = (e, t, n, r) => {
	En(e), r && (_n(e, n), _n(e, ~n)), e.pending_buf.set(e.window.subarray(t, t + n), e.pending), e.pending += n;
}, On = (e, t, n, r) => {
	let i = t * 2, a = n * 2;
	return e[i] < e[a] || e[i] === e[a] && r[t] <= r[n];
}, kn = (e, t, n) => {
	let r = e.heap[n], i = n << 1;
	for (; i <= e.heap_len && (i < e.heap_len && On(t, e.heap[i + 1], e.heap[i], e.depth) && i++, !On(t, r, e.heap[i], e.depth));) e.heap[n] = e.heap[i], n = i, i <<= 1;
	e.heap[n] = r;
}, An = (e, t, n) => {
	let r, i, a = 0, o, s;
	if (e.last_lit !== 0) do
		r = e.pending_buf[e.d_buf + a * 2] << 8 | e.pending_buf[e.d_buf + a * 2 + 1], i = e.pending_buf[e.l_buf + a], a++, r === 0 ? yn(e, i, t) : (o = cn[i], yn(e, o + Vt + 1, t), s = $t[o], s !== 0 && (i -= ln[o], vn(e, i, s)), r--, o = gn(r), yn(e, o, n), s = en[o], s !== 0 && (r -= un[o], vn(e, r, s)));
	while (a < e.last_lit);
	yn(e, Yt, t);
}, jn = (e, t) => {
	let n = t.dyn_tree, r = t.stat_desc.static_tree, i = t.stat_desc.has_stree, a = t.stat_desc.elems, o, s, c = -1, l;
	for (e.heap_len = 0, e.heap_max = Gt, o = 0; o < a; o++) n[o * 2] === 0 ? n[o * 2 + 1] = 0 : (e.heap[++e.heap_len] = c = o, e.depth[o] = 0);
	for (; e.heap_len < 2;) l = e.heap[++e.heap_len] = c < 2 ? ++c : 0, n[l * 2] = 1, e.depth[l] = 0, e.opt_len--, i && (e.static_len -= r[l * 2 + 1]);
	for (t.max_code = c, o = e.heap_len >> 1; o >= 1; o--) kn(e, n, o);
	l = a;
	do
		o = e.heap[1], e.heap[1] = e.heap[e.heap_len--], kn(e, n, 1), s = e.heap[1], e.heap[--e.heap_max] = o, e.heap[--e.heap_max] = s, n[l * 2] = n[o * 2] + n[s * 2], e.depth[l] = (e.depth[o] >= e.depth[s] ? e.depth[o] : e.depth[s]) + 1, n[o * 2 + 1] = n[s * 2 + 1] = l, e.heap[1] = l++, kn(e, n, 1);
	while (e.heap_len >= 2);
	e.heap[--e.heap_max] = e.heap[1], Sn(e, t), Cn(n, c, e.bl_count);
}, Mn = (e, t, n) => {
	let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
	for (o === 0 && (c = 138, l = 3), t[(n + 1) * 2 + 1] = 65535, r = 0; r <= n; r++) a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o) && (s < l ? e.bl_tree[a * 2] += s : a === 0 ? s <= 10 ? e.bl_tree[34]++ : e.bl_tree[36]++ : (a !== i && e.bl_tree[a * 2]++, e.bl_tree[32]++), s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4));
}, Nn = (e, t, n) => {
	let r, i = -1, a, o = t[1], s = 0, c = 7, l = 4;
	for (o === 0 && (c = 138, l = 3), r = 0; r <= n; r++) if (a = o, o = t[(r + 1) * 2 + 1], !(++s < c && a === o)) {
		if (s < l) do
			yn(e, a, e.bl_tree);
		while (--s !== 0);
		else a === 0 ? s <= 10 ? (yn(e, Zt, e.bl_tree), vn(e, s - 3, 3)) : (yn(e, Qt, e.bl_tree), vn(e, s - 11, 7)) : (a !== i && (yn(e, a, e.bl_tree), s--), yn(e, Xt, e.bl_tree), vn(e, s - 3, 2));
		s = 0, i = a, o === 0 ? (c = 138, l = 3) : a === o ? (c = 6, l = 3) : (c = 7, l = 4);
	}
}, Pn = (e) => {
	let t;
	for (Mn(e, e.dyn_ltree, e.l_desc.max_code), Mn(e, e.dyn_dtree, e.d_desc.max_code), jn(e, e.bl_desc), t = 18; t >= 3 && e.bl_tree[nn[t] * 2 + 1] === 0; t--);
	return e.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
}, Fn = (e, t, n, r) => {
	let i;
	for (vn(e, t - 257, 5), vn(e, n - 1, 5), vn(e, r - 4, 4), i = 0; i < r; i++) vn(e, e.bl_tree[nn[i] * 2 + 1], 3);
	Nn(e, e.dyn_ltree, t - 1), Nn(e, e.dyn_dtree, n - 1);
}, In = (e) => {
	let t = 4093624447, n;
	for (n = 0; n <= 31; n++, t >>>= 1) if (t & 1 && e.dyn_ltree[n * 2] !== 0) return It;
	if (e.dyn_ltree[18] !== 0 || e.dyn_ltree[20] !== 0 || e.dyn_ltree[26] !== 0) return Lt;
	for (n = 32; n < Vt; n++) if (e.dyn_ltree[n * 2] !== 0) return Lt;
	return It;
}, Ln = !1, Rn = (e) => {
	Ln ||= (wn(), !0), e.l_desc = new hn(e.dyn_ltree, fn), e.d_desc = new hn(e.dyn_dtree, pn), e.bl_desc = new hn(e.bl_tree, mn), e.bi_buf = 0, e.bi_valid = 0, Tn(e);
}, zn = (e, t, n, r) => {
	vn(e, 0 + +!!r, 3), Dn(e, t, n, !0);
}, Bn = {
	_tr_init: Rn,
	_tr_stored_block: zn,
	_tr_flush_block: (e, t, n, r) => {
		let i, a, o = 0;
		e.level > 0 ? (e.strm.data_type === Rt && (e.strm.data_type = In(e)), jn(e, e.l_desc), jn(e, e.d_desc), o = Pn(e), i = e.opt_len + 3 + 7 >>> 3, a = e.static_len + 3 + 7 >>> 3, a <= i && (i = a)) : i = a = n + 5, n + 4 <= i && t !== -1 ? zn(e, t, n, r) : e.strategy === Ft || a === i ? (vn(e, 2 + +!!r, 3), An(e, an, on)) : (vn(e, 4 + +!!r, 3), Fn(e, e.l_desc.max_code + 1, e.d_desc.max_code + 1, o + 1), An(e, e.dyn_ltree, e.dyn_dtree)), Tn(e), r && En(e);
	},
	_tr_tally: (e, t, n) => (e.pending_buf[e.d_buf + e.last_lit * 2] = t >>> 8 & 255, e.pending_buf[e.d_buf + e.last_lit * 2 + 1] = t & 255, e.pending_buf[e.l_buf + e.last_lit] = n & 255, e.last_lit++, t === 0 ? e.dyn_ltree[n * 2]++ : (e.matches++, t--, e.dyn_ltree[(cn[n] + Vt + 1) * 2]++, e.dyn_dtree[gn(t) * 2]++), e.last_lit === e.lit_bufsize - 1),
	_tr_align: (e) => {
		vn(e, 2, 3), yn(e, Yt, an), xn(e);
	}
}, Vn = (e, t, n, r) => {
	let i = e & 65535 | 0, a = e >>> 16 & 65535 | 0, o = 0;
	for (; n !== 0;) {
		o = n > 2e3 ? 2e3 : n, n -= o;
		do
			i = i + t[r++] | 0, a = a + i | 0;
		while (--o);
		i %= 65521, a %= 65521;
	}
	return i | a << 16 | 0;
}, Hn = new Uint32Array((() => {
	let e, t = [];
	for (var n = 0; n < 256; n++) {
		e = n;
		for (var r = 0; r < 8; r++) e = e & 1 ? 3988292384 ^ e >>> 1 : e >>> 1;
		t[n] = e;
	}
	return t;
})()), Un = (e, t, n, r) => {
	let i = Hn, a = r + n;
	e ^= -1;
	for (let n = r; n < a; n++) e = e >>> 8 ^ i[(e ^ t[n]) & 255];
	return e ^ -1;
}, Wn = {
	2: "need dictionary",
	1: "stream end",
	0: "",
	"-1": "file error",
	"-2": "stream error",
	"-3": "data error",
	"-4": "insufficient memory",
	"-5": "buffer error",
	"-6": "incompatible version"
}, Gn = {
	Z_NO_FLUSH: 0,
	Z_PARTIAL_FLUSH: 1,
	Z_SYNC_FLUSH: 2,
	Z_FULL_FLUSH: 3,
	Z_FINISH: 4,
	Z_BLOCK: 5,
	Z_TREES: 6,
	Z_OK: 0,
	Z_STREAM_END: 1,
	Z_NEED_DICT: 2,
	Z_ERRNO: -1,
	Z_STREAM_ERROR: -2,
	Z_DATA_ERROR: -3,
	Z_MEM_ERROR: -4,
	Z_BUF_ERROR: -5,
	Z_NO_COMPRESSION: 0,
	Z_BEST_SPEED: 1,
	Z_BEST_COMPRESSION: 9,
	Z_DEFAULT_COMPRESSION: -1,
	Z_FILTERED: 1,
	Z_HUFFMAN_ONLY: 2,
	Z_RLE: 3,
	Z_FIXED: 4,
	Z_DEFAULT_STRATEGY: 0,
	Z_BINARY: 0,
	Z_TEXT: 1,
	Z_UNKNOWN: 2,
	Z_DEFLATED: 8
}, { _tr_init: Kn, _tr_stored_block: qn, _tr_flush_block: Jn, _tr_tally: Yn, _tr_align: Xn } = Bn, { Z_NO_FLUSH: Zn, Z_PARTIAL_FLUSH: Qn, Z_FULL_FLUSH: $n, Z_FINISH: er, Z_BLOCK: tr, Z_OK: nr, Z_STREAM_END: rr, Z_STREAM_ERROR: ir, Z_DATA_ERROR: ar, Z_BUF_ERROR: or, Z_DEFAULT_COMPRESSION: sr, Z_FILTERED: cr, Z_HUFFMAN_ONLY: lr, Z_RLE: ur, Z_FIXED: dr, Z_DEFAULT_STRATEGY: fr, Z_UNKNOWN: pr, Z_DEFLATED: mr } = Gn, hr = 9, gr = 15, _r = 8, vr = 573, Z = 3, yr = 258, br = 262, xr = 32, Sr = 42, Cr = 69, wr = 73, Tr = 91, Er = 103, Dr = 113, Or = 666, kr = 1, Ar = 2, jr = 3, Mr = 4, Nr = 3, Pr = (e, t) => (e.msg = Wn[t], t), Fr = (e) => (e << 1) - (e > 4 ? 9 : 0), Ir = (e) => {
	let t = e.length;
	for (; --t >= 0;) e[t] = 0;
}, Lr = (e, t, n) => (t << e.hash_shift ^ n) & e.hash_mask, Rr = (e) => {
	let t = e.state, n = t.pending;
	n > e.avail_out && (n = e.avail_out), n !== 0 && (e.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + n), e.next_out), e.next_out += n, t.pending_out += n, e.total_out += n, e.avail_out -= n, t.pending -= n, t.pending === 0 && (t.pending_out = 0));
}, zr = (e, t) => {
	Jn(e, e.block_start >= 0 ? e.block_start : -1, e.strstart - e.block_start, t), e.block_start = e.strstart, Rr(e.strm);
}, Q = (e, t) => {
	e.pending_buf[e.pending++] = t;
}, Br = (e, t) => {
	e.pending_buf[e.pending++] = t >>> 8 & 255, e.pending_buf[e.pending++] = t & 255;
}, Vr = (e, t, n, r) => {
	let i = e.avail_in;
	return i > r && (i = r), i === 0 ? 0 : (e.avail_in -= i, t.set(e.input.subarray(e.next_in, e.next_in + i), n), e.state.wrap === 1 ? e.adler = Vn(e.adler, t, i, n) : e.state.wrap === 2 && (e.adler = Un(e.adler, t, i, n)), e.next_in += i, e.total_in += i, i);
}, Hr = (e, t) => {
	let n = e.max_chain_length, r = e.strstart, i, a, o = e.prev_length, s = e.nice_match, c = e.strstart > e.w_size - br ? e.strstart - (e.w_size - br) : 0, l = e.window, u = e.w_mask, d = e.prev, f = e.strstart + yr, p = l[r + o - 1], m = l[r + o];
	e.prev_length >= e.good_match && (n >>= 2), s > e.lookahead && (s = e.lookahead);
	do
		if (i = t, l[i + o] === m && l[i + o - 1] === p && l[i] === l[r] && l[++i] === l[r + 1]) {
			r += 2, i++;
			do			;
while (l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && l[++r] === l[++i] && r < f);
			if (a = yr - (f - r), r = f - yr, a > o) {
				if (e.match_start = t, o = a, a >= s) break;
				p = l[r + o - 1], m = l[r + o];
			}
		}
	while ((t = d[t & u]) > c && --n !== 0);
	return o <= e.lookahead ? o : e.lookahead;
}, Ur = (e) => {
	let t = e.w_size, n, r, i, a, o;
	do {
		if (a = e.window_size - e.lookahead - e.strstart, e.strstart >= t + (t - br)) {
			e.window.set(e.window.subarray(t, t + t), 0), e.match_start -= t, e.strstart -= t, e.block_start -= t, r = e.hash_size, n = r;
			do
				i = e.head[--n], e.head[n] = i >= t ? i - t : 0;
			while (--r);
			r = t, n = r;
			do
				i = e.prev[--n], e.prev[n] = i >= t ? i - t : 0;
			while (--r);
			a += t;
		}
		if (e.strm.avail_in === 0) break;
		if (r = Vr(e.strm, e.window, e.strstart + e.lookahead, a), e.lookahead += r, e.lookahead + e.insert >= Z) for (o = e.strstart - e.insert, e.ins_h = e.window[o], e.ins_h = Lr(e, e.ins_h, e.window[o + 1]); e.insert && (e.ins_h = Lr(e, e.ins_h, e.window[o + Z - 1]), e.prev[o & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = o, o++, e.insert--, !(e.lookahead + e.insert < Z)););
	} while (e.lookahead < br && e.strm.avail_in !== 0);
}, Wr = (e, t) => {
	let n = 65535;
	for (n > e.pending_buf_size - 5 && (n = e.pending_buf_size - 5);;) {
		if (e.lookahead <= 1) {
			if (Ur(e), e.lookahead === 0 && t === Zn) return kr;
			if (e.lookahead === 0) break;
		}
		e.strstart += e.lookahead, e.lookahead = 0;
		let r = e.block_start + n;
		if ((e.strstart === 0 || e.strstart >= r) && (e.lookahead = e.strstart - r, e.strstart = r, zr(e, !1), e.strm.avail_out === 0) || e.strstart - e.block_start >= e.w_size - br && (zr(e, !1), e.strm.avail_out === 0)) return kr;
	}
	return e.insert = 0, t === er ? (zr(e, !0), e.strm.avail_out === 0 ? jr : Mr) : (e.strstart > e.block_start && (zr(e, !1), e.strm.avail_out), kr);
}, Gr = (e, t) => {
	let n, r;
	for (;;) {
		if (e.lookahead < br) {
			if (Ur(e), e.lookahead < br && t === Zn) return kr;
			if (e.lookahead === 0) break;
		}
		if (n = 0, e.lookahead >= Z && (e.ins_h = Lr(e, e.ins_h, e.window[e.strstart + Z - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), n !== 0 && e.strstart - n <= e.w_size - br && (e.match_length = Hr(e, n)), e.match_length >= Z) {
			if (r = Yn(e, e.strstart - e.match_start, e.match_length - Z), e.lookahead -= e.match_length, e.match_length <= e.max_lazy_match && e.lookahead >= Z) {
				e.match_length--;
				do
					e.strstart++, e.ins_h = Lr(e, e.ins_h, e.window[e.strstart + Z - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart;
				while (--e.match_length !== 0);
				e.strstart++;
			} else e.strstart += e.match_length, e.match_length = 0, e.ins_h = e.window[e.strstart], e.ins_h = Lr(e, e.ins_h, e.window[e.strstart + 1]);
		} else r = Yn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++;
		if (r && (zr(e, !1), e.strm.avail_out === 0)) return kr;
	}
	return e.insert = e.strstart < 2 ? e.strstart : 2, t === er ? (zr(e, !0), e.strm.avail_out === 0 ? jr : Mr) : e.last_lit && (zr(e, !1), e.strm.avail_out === 0) ? kr : Ar;
}, Kr = (e, t) => {
	let n, r, i;
	for (;;) {
		if (e.lookahead < br) {
			if (Ur(e), e.lookahead < br && t === Zn) return kr;
			if (e.lookahead === 0) break;
		}
		if (n = 0, e.lookahead >= Z && (e.ins_h = Lr(e, e.ins_h, e.window[e.strstart + Z - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart), e.prev_length = e.match_length, e.prev_match = e.match_start, e.match_length = 2, n !== 0 && e.prev_length < e.max_lazy_match && e.strstart - n <= e.w_size - br && (e.match_length = Hr(e, n), e.match_length <= 5 && (e.strategy === cr || e.match_length === Z && e.strstart - e.match_start > 4096) && (e.match_length = 2)), e.prev_length >= Z && e.match_length <= e.prev_length) {
			i = e.strstart + e.lookahead - Z, r = Yn(e, e.strstart - 1 - e.prev_match, e.prev_length - Z), e.lookahead -= e.prev_length - 1, e.prev_length -= 2;
			do
				++e.strstart <= i && (e.ins_h = Lr(e, e.ins_h, e.window[e.strstart + Z - 1]), n = e.prev[e.strstart & e.w_mask] = e.head[e.ins_h], e.head[e.ins_h] = e.strstart);
			while (--e.prev_length !== 0);
			if (e.match_available = 0, e.match_length = 2, e.strstart++, r && (zr(e, !1), e.strm.avail_out === 0)) return kr;
		} else if (e.match_available) {
			if (r = Yn(e, 0, e.window[e.strstart - 1]), r && zr(e, !1), e.strstart++, e.lookahead--, e.strm.avail_out === 0) return kr;
		} else e.match_available = 1, e.strstart++, e.lookahead--;
	}
	return e.match_available &&= (r = Yn(e, 0, e.window[e.strstart - 1]), 0), e.insert = e.strstart < 2 ? e.strstart : 2, t === er ? (zr(e, !0), e.strm.avail_out === 0 ? jr : Mr) : e.last_lit && (zr(e, !1), e.strm.avail_out === 0) ? kr : Ar;
}, qr = (e, t) => {
	let n, r, i, a, o = e.window;
	for (;;) {
		if (e.lookahead <= yr) {
			if (Ur(e), e.lookahead <= yr && t === Zn) return kr;
			if (e.lookahead === 0) break;
		}
		if (e.match_length = 0, e.lookahead >= Z && e.strstart > 0 && (i = e.strstart - 1, r = o[i], r === o[++i] && r === o[++i] && r === o[++i])) {
			a = e.strstart + yr;
			do			;
while (r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && r === o[++i] && i < a);
			e.match_length = yr - (a - i), e.match_length > e.lookahead && (e.match_length = e.lookahead);
		}
		if (e.match_length >= Z ? (n = Yn(e, 1, e.match_length - Z), e.lookahead -= e.match_length, e.strstart += e.match_length, e.match_length = 0) : (n = Yn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++), n && (zr(e, !1), e.strm.avail_out === 0)) return kr;
	}
	return e.insert = 0, t === er ? (zr(e, !0), e.strm.avail_out === 0 ? jr : Mr) : e.last_lit && (zr(e, !1), e.strm.avail_out === 0) ? kr : Ar;
}, Jr = (e, t) => {
	let n;
	for (;;) {
		if (e.lookahead === 0 && (Ur(e), e.lookahead === 0)) {
			if (t === Zn) return kr;
			break;
		}
		if (e.match_length = 0, n = Yn(e, 0, e.window[e.strstart]), e.lookahead--, e.strstart++, n && (zr(e, !1), e.strm.avail_out === 0)) return kr;
	}
	return e.insert = 0, t === er ? (zr(e, !0), e.strm.avail_out === 0 ? jr : Mr) : e.last_lit && (zr(e, !1), e.strm.avail_out === 0) ? kr : Ar;
};
function Yr(e, t, n, r, i) {
	this.good_length = e, this.max_lazy = t, this.nice_length = n, this.max_chain = r, this.func = i;
}
var Xr = [
	new Yr(0, 0, 0, 0, Wr),
	new Yr(4, 4, 8, 4, Gr),
	new Yr(4, 5, 16, 8, Gr),
	new Yr(4, 6, 32, 32, Gr),
	new Yr(4, 4, 16, 16, Kr),
	new Yr(8, 16, 32, 32, Kr),
	new Yr(8, 16, 128, 128, Kr),
	new Yr(8, 32, 128, 256, Kr),
	new Yr(32, 128, 258, 1024, Kr),
	new Yr(32, 258, 258, 4096, Kr)
], Zr = (e) => {
	e.window_size = 2 * e.w_size, Ir(e.head), e.max_lazy_match = Xr[e.level].max_lazy, e.good_match = Xr[e.level].good_length, e.nice_match = Xr[e.level].nice_length, e.max_chain_length = Xr[e.level].max_chain, e.strstart = 0, e.block_start = 0, e.lookahead = 0, e.insert = 0, e.match_length = e.prev_length = 2, e.match_available = 0, e.ins_h = 0;
};
function Qr() {
	this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = mr, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(vr * 2), this.dyn_dtree = /* @__PURE__ */ new Uint16Array(122), this.bl_tree = /* @__PURE__ */ new Uint16Array(78), Ir(this.dyn_ltree), Ir(this.dyn_dtree), Ir(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = /* @__PURE__ */ new Uint16Array(16), this.heap = /* @__PURE__ */ new Uint16Array(573), Ir(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = /* @__PURE__ */ new Uint16Array(573), Ir(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
var $r = (e) => {
	if (!e || !e.state) return Pr(e, ir);
	e.total_in = e.total_out = 0, e.data_type = pr;
	let t = e.state;
	return t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = t.wrap ? Sr : Dr, e.adler = t.wrap === 2 ? 0 : 1, t.last_flush = Zn, Kn(t), nr;
}, ei = (e) => {
	let t = $r(e);
	return t === nr && Zr(e.state), t;
}, ti = (e, t) => !e || !e.state || e.state.wrap !== 2 ? ir : (e.state.gzhead = t, nr), ni = (e, t, n, r, i, a) => {
	if (!e) return ir;
	let o = 1;
	if (t === sr && (t = 6), r < 0 ? (o = 0, r = -r) : r > 15 && (o = 2, r -= 16), i < 1 || i > hr || n !== mr || r < 8 || r > 15 || t < 0 || t > 9 || a < 0 || a > dr) return Pr(e, ir);
	r === 8 && (r = 9);
	let s = new Qr();
	return e.state = s, s.strm = e, s.wrap = o, s.gzhead = null, s.w_bits = r, s.w_size = 1 << s.w_bits, s.w_mask = s.w_size - 1, s.hash_bits = i + 7, s.hash_size = 1 << s.hash_bits, s.hash_mask = s.hash_size - 1, s.hash_shift = ~~((s.hash_bits + Z - 1) / Z), s.window = new Uint8Array(s.w_size * 2), s.head = new Uint16Array(s.hash_size), s.prev = new Uint16Array(s.w_size), s.lit_bufsize = 1 << i + 6, s.pending_buf_size = s.lit_bufsize * 4, s.pending_buf = new Uint8Array(s.pending_buf_size), s.d_buf = 1 * s.lit_bufsize, s.l_buf = 3 * s.lit_bufsize, s.level = t, s.strategy = a, s.method = n, ei(e);
}, ri = {
	deflateInit: (e, t) => ni(e, t, mr, gr, _r, fr),
	deflateInit2: ni,
	deflateReset: ei,
	deflateResetKeep: $r,
	deflateSetHeader: ti,
	deflate: (e, t) => {
		let n, r;
		if (!e || !e.state || t > tr || t < 0) return e ? Pr(e, ir) : ir;
		let i = e.state;
		if (!e.output || !e.input && e.avail_in !== 0 || i.status === Or && t !== er) return Pr(e, e.avail_out === 0 ? or : ir);
		i.strm = e;
		let a = i.last_flush;
		if (i.last_flush = t, i.status === Sr) {
			if (i.wrap === 2) e.adler = 0, Q(i, 31), Q(i, 139), Q(i, 8), i.gzhead ? (Q(i, +!!i.gzhead.text + (i.gzhead.hcrc ? 2 : 0) + (i.gzhead.extra ? 4 : 0) + (i.gzhead.name ? 8 : 0) + (i.gzhead.comment ? 16 : 0)), Q(i, i.gzhead.time & 255), Q(i, i.gzhead.time >> 8 & 255), Q(i, i.gzhead.time >> 16 & 255), Q(i, i.gzhead.time >> 24 & 255), Q(i, i.level === 9 ? 2 : i.strategy >= lr || i.level < 2 ? 4 : 0), Q(i, i.gzhead.os & 255), i.gzhead.extra && i.gzhead.extra.length && (Q(i, i.gzhead.extra.length & 255), Q(i, i.gzhead.extra.length >> 8 & 255)), i.gzhead.hcrc && (e.adler = Un(e.adler, i.pending_buf, i.pending, 0)), i.gzindex = 0, i.status = Cr) : (Q(i, 0), Q(i, 0), Q(i, 0), Q(i, 0), Q(i, 0), Q(i, i.level === 9 ? 2 : i.strategy >= lr || i.level < 2 ? 4 : 0), Q(i, Nr), i.status = Dr);
			else {
				let t = mr + (i.w_bits - 8 << 4) << 8, n = -1;
				n = i.strategy >= lr || i.level < 2 ? 0 : i.level < 6 ? 1 : i.level === 6 ? 2 : 3, t |= n << 6, i.strstart !== 0 && (t |= xr), t += 31 - t % 31, i.status = Dr, Br(i, t), i.strstart !== 0 && (Br(i, e.adler >>> 16), Br(i, e.adler & 65535)), e.adler = 1;
			}
		}
		if (i.status === Cr) {
			if (i.gzhead.extra) {
				for (n = i.pending; i.gzindex < (i.gzhead.extra.length & 65535) && !(i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (e.adler = Un(e.adler, i.pending_buf, i.pending - n, n)), Rr(e), n = i.pending, i.pending === i.pending_buf_size));) Q(i, i.gzhead.extra[i.gzindex] & 255), i.gzindex++;
				i.gzhead.hcrc && i.pending > n && (e.adler = Un(e.adler, i.pending_buf, i.pending - n, n)), i.gzindex === i.gzhead.extra.length && (i.gzindex = 0, i.status = wr);
			} else i.status = wr;
		}
		if (i.status === wr) {
			if (i.gzhead.name) {
				n = i.pending;
				do {
					if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (e.adler = Un(e.adler, i.pending_buf, i.pending - n, n)), Rr(e), n = i.pending, i.pending === i.pending_buf_size)) {
						r = 1;
						break;
					}
					r = i.gzindex < i.gzhead.name.length ? i.gzhead.name.charCodeAt(i.gzindex++) & 255 : 0, Q(i, r);
				} while (r !== 0);
				i.gzhead.hcrc && i.pending > n && (e.adler = Un(e.adler, i.pending_buf, i.pending - n, n)), r === 0 && (i.gzindex = 0, i.status = Tr);
			} else i.status = Tr;
		}
		if (i.status === Tr) {
			if (i.gzhead.comment) {
				n = i.pending;
				do {
					if (i.pending === i.pending_buf_size && (i.gzhead.hcrc && i.pending > n && (e.adler = Un(e.adler, i.pending_buf, i.pending - n, n)), Rr(e), n = i.pending, i.pending === i.pending_buf_size)) {
						r = 1;
						break;
					}
					r = i.gzindex < i.gzhead.comment.length ? i.gzhead.comment.charCodeAt(i.gzindex++) & 255 : 0, Q(i, r);
				} while (r !== 0);
				i.gzhead.hcrc && i.pending > n && (e.adler = Un(e.adler, i.pending_buf, i.pending - n, n)), r === 0 && (i.status = Er);
			} else i.status = Er;
		}
		if (i.status === Er && (i.gzhead.hcrc ? (i.pending + 2 > i.pending_buf_size && Rr(e), i.pending + 2 <= i.pending_buf_size && (Q(i, e.adler & 255), Q(i, e.adler >> 8 & 255), e.adler = 0, i.status = Dr)) : i.status = Dr), i.pending !== 0) {
			if (Rr(e), e.avail_out === 0) return i.last_flush = -1, nr;
		} else if (e.avail_in === 0 && Fr(t) <= Fr(a) && t !== er) return Pr(e, or);
		if (i.status === Or && e.avail_in !== 0) return Pr(e, or);
		if (e.avail_in !== 0 || i.lookahead !== 0 || t !== Zn && i.status !== Or) {
			let n = i.strategy === lr ? Jr(i, t) : i.strategy === ur ? qr(i, t) : Xr[i.level].func(i, t);
			if ((n === jr || n === Mr) && (i.status = Or), n === kr || n === jr) return e.avail_out === 0 && (i.last_flush = -1), nr;
			if (n === Ar && (t === Qn ? Xn(i) : t !== tr && (qn(i, 0, 0, !1), t === $n && (Ir(i.head), i.lookahead === 0 && (i.strstart = 0, i.block_start = 0, i.insert = 0))), Rr(e), e.avail_out === 0)) return i.last_flush = -1, nr;
		}
		return t === er ? i.wrap <= 0 ? rr : (i.wrap === 2 ? (Q(i, e.adler & 255), Q(i, e.adler >> 8 & 255), Q(i, e.adler >> 16 & 255), Q(i, e.adler >> 24 & 255), Q(i, e.total_in & 255), Q(i, e.total_in >> 8 & 255), Q(i, e.total_in >> 16 & 255), Q(i, e.total_in >> 24 & 255)) : (Br(i, e.adler >>> 16), Br(i, e.adler & 65535)), Rr(e), i.wrap > 0 && (i.wrap = -i.wrap), i.pending === 0 ? rr : nr) : nr;
	},
	deflateEnd: (e) => {
		if (!e || !e.state) return ir;
		let t = e.state.status;
		return t !== Sr && t !== Cr && t !== wr && t !== Tr && t !== Er && t !== Dr && t !== Or ? Pr(e, ir) : (e.state = null, t === Dr ? Pr(e, ar) : nr);
	},
	deflateSetDictionary: (e, t) => {
		let n = t.length;
		if (!e || !e.state) return ir;
		let r = e.state, i = r.wrap;
		if (i === 2 || i === 1 && r.status !== Sr || r.lookahead) return ir;
		if (i === 1 && (e.adler = Vn(e.adler, t, n, 0)), r.wrap = 0, n >= r.w_size) {
			i === 0 && (Ir(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0);
			let e = new Uint8Array(r.w_size);
			e.set(t.subarray(n - r.w_size, n), 0), t = e, n = r.w_size;
		}
		let a = e.avail_in, o = e.next_in, s = e.input;
		for (e.avail_in = n, e.next_in = 0, e.input = t, Ur(r); r.lookahead >= Z;) {
			let e = r.strstart, t = r.lookahead - 2;
			do
				r.ins_h = Lr(r, r.ins_h, r.window[e + Z - 1]), r.prev[e & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = e, e++;
			while (--t);
			r.strstart = e, r.lookahead = 2, Ur(r);
		}
		return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = 2, r.match_available = 0, e.next_in = o, e.input = s, e.avail_in = a, r.wrap = i, nr;
	},
	deflateInfo: "pako deflate (from Nodeca project)"
}, ii = (e, t) => Object.prototype.hasOwnProperty.call(e, t), ai = {
	assign: function(e) {
		let t = Array.prototype.slice.call(arguments, 1);
		for (; t.length;) {
			let n = t.shift();
			if (n) {
				if (typeof n != "object") throw TypeError(n + "must be non-object");
				for (let t in n) ii(n, t) && (e[t] = n[t]);
			}
		}
		return e;
	},
	flattenChunks: (e) => {
		let t = 0;
		for (let n = 0, r = e.length; n < r; n++) t += e[n].length;
		let n = new Uint8Array(t);
		for (let t = 0, r = 0, i = e.length; t < i; t++) {
			let i = e[t];
			n.set(i, r), r += i.length;
		}
		return n;
	}
}, oi = !0;
try {
	String.fromCharCode.apply(null, /* @__PURE__ */ new Uint8Array(1));
} catch {
	oi = !1;
}
var si = /* @__PURE__ */ new Uint8Array(256);
for (let e = 0; e < 256; e++) si[e] = e >= 252 ? 6 : e >= 248 ? 5 : e >= 240 ? 4 : e >= 224 ? 3 : e >= 192 ? 2 : 1;
si[254] = si[254] = 1;
var ci = (e) => {
	if (typeof TextEncoder == "function" && TextEncoder.prototype.encode) return new TextEncoder().encode(e);
	let t, n, r, i, a, o = e.length, s = 0;
	for (i = 0; i < o; i++) n = e.charCodeAt(i), (n & 64512) == 55296 && i + 1 < o && (r = e.charCodeAt(i + 1), (r & 64512) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), s += n < 128 ? 1 : n < 2048 ? 2 : n < 65536 ? 3 : 4;
	for (t = new Uint8Array(s), a = 0, i = 0; a < s; i++) n = e.charCodeAt(i), (n & 64512) == 55296 && i + 1 < o && (r = e.charCodeAt(i + 1), (r & 64512) == 56320 && (n = 65536 + (n - 55296 << 10) + (r - 56320), i++)), n < 128 ? t[a++] = n : n < 2048 ? (t[a++] = 192 | n >>> 6, t[a++] = 128 | n & 63) : n < 65536 ? (t[a++] = 224 | n >>> 12, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | n & 63) : (t[a++] = 240 | n >>> 18, t[a++] = 128 | n >>> 12 & 63, t[a++] = 128 | n >>> 6 & 63, t[a++] = 128 | n & 63);
	return t;
}, li = (e, t) => {
	if (t < 65534 && e.subarray && oi) return String.fromCharCode.apply(null, e.length === t ? e : e.subarray(0, t));
	let n = "";
	for (let r = 0; r < t; r++) n += String.fromCharCode(e[r]);
	return n;
}, ui = {
	string2buf: ci,
	buf2string: (e, t) => {
		let n = t || e.length;
		if (typeof TextDecoder == "function" && TextDecoder.prototype.decode) return new TextDecoder().decode(e.subarray(0, t));
		let r, i, a = Array(n * 2);
		for (i = 0, r = 0; r < n;) {
			let t = e[r++];
			if (t < 128) {
				a[i++] = t;
				continue;
			}
			let o = si[t];
			if (o > 4) {
				a[i++] = 65533, r += o - 1;
				continue;
			}
			for (t &= o === 2 ? 31 : o === 3 ? 15 : 7; o > 1 && r < n;) t = t << 6 | e[r++] & 63, o--;
			if (o > 1) {
				a[i++] = 65533;
				continue;
			}
			t < 65536 ? a[i++] = t : (t -= 65536, a[i++] = 55296 | t >> 10 & 1023, a[i++] = 56320 | t & 1023);
		}
		return li(a, i);
	},
	utf8border: (e, t) => {
		t ||= e.length, t > e.length && (t = e.length);
		let n = t - 1;
		for (; n >= 0 && (e[n] & 192) == 128;) n--;
		return n < 0 || n === 0 ? t : n + si[e[n]] > t ? n : t;
	}
};
function di() {
	this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var fi = di, pi = Object.prototype.toString, { Z_NO_FLUSH: mi, Z_SYNC_FLUSH: hi, Z_FULL_FLUSH: gi, Z_FINISH: _i, Z_OK: vi, Z_STREAM_END: yi, Z_DEFAULT_COMPRESSION: bi, Z_DEFAULT_STRATEGY: xi, Z_DEFLATED: Si } = Gn;
function Ci(e) {
	this.options = ai.assign({
		level: bi,
		method: Si,
		chunkSize: 16384,
		windowBits: 15,
		memLevel: 8,
		strategy: xi
	}, e || {});
	let t = this.options;
	t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new fi(), this.strm.avail_out = 0;
	let n = ri.deflateInit2(this.strm, t.level, t.method, t.windowBits, t.memLevel, t.strategy);
	if (n !== vi) throw Error(Wn[n]);
	if (t.header && ri.deflateSetHeader(this.strm, t.header), t.dictionary) {
		let e;
		if (e = typeof t.dictionary == "string" ? ui.string2buf(t.dictionary) : pi.call(t.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(t.dictionary) : t.dictionary, n = ri.deflateSetDictionary(this.strm, e), n !== vi) throw Error(Wn[n]);
		this._dict_set = !0;
	}
}
Ci.prototype.push = function(e, t) {
	let n = this.strm, r = this.options.chunkSize, i, a;
	if (this.ended) return !1;
	for (a = t === ~~t ? t : t === !0 ? _i : mi, n.input = typeof e == "string" ? ui.string2buf(e) : pi.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, n.next_in = 0, n.avail_in = n.input.length;;) {
		if (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), (a === hi || a === gi) && n.avail_out <= 6) {
			this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
			continue;
		}
		if (i = ri.deflate(n, a), i === yi) return n.next_out > 0 && this.onData(n.output.subarray(0, n.next_out)), i = ri.deflateEnd(this.strm), this.onEnd(i), this.ended = !0, i === vi;
		if (n.avail_out === 0) {
			this.onData(n.output);
			continue;
		}
		if (a > 0 && n.next_out > 0) {
			this.onData(n.output.subarray(0, n.next_out)), n.avail_out = 0;
			continue;
		}
		if (n.avail_in === 0) break;
	}
	return !0;
}, Ci.prototype.onData = function(e) {
	this.chunks.push(e);
}, Ci.prototype.onEnd = function(e) {
	e === vi && (this.result = ai.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function wi(e, t) {
	let n = new Ci(t);
	if (n.push(e, !0), n.err) throw n.msg || Wn[n.err];
	return n.result;
}
function Ti(e, t) {
	return t ||= {}, t.raw = !0, wi(e, t);
}
function Ei(e, t) {
	return t ||= {}, t.gzip = !0, wi(e, t);
}
var Di = {
	Deflate: Ci,
	deflate: wi,
	deflateRaw: Ti,
	gzip: Ei,
	constants: Gn
}, Oi = 30, ki = 12, Ai = function(e, t) {
	let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x, S, C, w, T, E = e.state;
	n = e.next_in, w = e.input, r = n + (e.avail_in - 5), i = e.next_out, T = e.output, a = i - (t - e.avail_out), o = i + (e.avail_out - 257), s = E.dmax, c = E.wsize, l = E.whave, u = E.wnext, d = E.window, f = E.hold, p = E.bits, m = E.lencode, h = E.distcode, g = (1 << E.lenbits) - 1, _ = (1 << E.distbits) - 1;
	top: do {
		p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = m[f & g];
		dolen: for (;;) {
			if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y === 0) T[i++] = v & 65535;
			else if (y & 16) {
				b = v & 65535, y &= 15, y && (p < y && (f += w[n++] << p, p += 8), b += f & (1 << y) - 1, f >>>= y, p -= y), p < 15 && (f += w[n++] << p, p += 8, f += w[n++] << p, p += 8), v = h[f & _];
				dodist: for (;;) {
					if (y = v >>> 24, f >>>= y, p -= y, y = v >>> 16 & 255, y & 16) {
						if (x = v & 65535, y &= 15, p < y && (f += w[n++] << p, p += 8, p < y && (f += w[n++] << p, p += 8)), x += f & (1 << y) - 1, x > s) {
							e.msg = "invalid distance too far back", E.mode = Oi;
							break top;
						}
						if (f >>>= y, p -= y, y = i - a, x > y) {
							if (y = x - y, y > l && E.sane) {
								e.msg = "invalid distance too far back", E.mode = Oi;
								break top;
							}
							if (S = 0, C = d, u === 0) {
								if (S += c - y, y < b) {
									b -= y;
									do
										T[i++] = d[S++];
									while (--y);
									S = i - x, C = T;
								}
							} else if (u < y) {
								if (S += c + u - y, y -= u, y < b) {
									b -= y;
									do
										T[i++] = d[S++];
									while (--y);
									if (S = 0, u < b) {
										y = u, b -= y;
										do
											T[i++] = d[S++];
										while (--y);
										S = i - x, C = T;
									}
								}
							} else if (S += u - y, y < b) {
								b -= y;
								do
									T[i++] = d[S++];
								while (--y);
								S = i - x, C = T;
							}
							for (; b > 2;) T[i++] = C[S++], T[i++] = C[S++], T[i++] = C[S++], b -= 3;
							b && (T[i++] = C[S++], b > 1 && (T[i++] = C[S++]));
						} else {
							S = i - x;
							do
								T[i++] = T[S++], T[i++] = T[S++], T[i++] = T[S++], b -= 3;
							while (b > 2);
							b && (T[i++] = T[S++], b > 1 && (T[i++] = T[S++]));
						}
					} else if (y & 64) {
						e.msg = "invalid distance code", E.mode = Oi;
						break top;
					} else {
						v = h[(v & 65535) + (f & (1 << y) - 1)];
						continue dodist;
					}
					break;
				}
			} else if (!(y & 64)) {
				v = m[(v & 65535) + (f & (1 << y) - 1)];
				continue dolen;
			} else if (y & 32) {
				E.mode = ki;
				break top;
			} else {
				e.msg = "invalid literal/length code", E.mode = Oi;
				break top;
			}
			break;
		}
	} while (n < r && i < o);
	b = p >> 3, n -= b, p -= b << 3, f &= (1 << p) - 1, e.next_in = n, e.next_out = i, e.avail_in = n < r ? 5 + (r - n) : 5 - (n - r), e.avail_out = i < o ? 257 + (o - i) : 257 - (i - o), E.hold = f, E.bits = p;
}, ji = 15, Mi = 852, Ni = 592, Pi = 0, Fi = 1, Ii = 2, Li = new Uint16Array([
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	13,
	15,
	17,
	19,
	23,
	27,
	31,
	35,
	43,
	51,
	59,
	67,
	83,
	99,
	115,
	131,
	163,
	195,
	227,
	258,
	0,
	0
]), Ri = new Uint8Array([
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	16,
	17,
	17,
	17,
	17,
	18,
	18,
	18,
	18,
	19,
	19,
	19,
	19,
	20,
	20,
	20,
	20,
	21,
	21,
	21,
	21,
	16,
	72,
	78
]), zi = new Uint16Array([
	1,
	2,
	3,
	4,
	5,
	7,
	9,
	13,
	17,
	25,
	33,
	49,
	65,
	97,
	129,
	193,
	257,
	385,
	513,
	769,
	1025,
	1537,
	2049,
	3073,
	4097,
	6145,
	8193,
	12289,
	16385,
	24577,
	0,
	0
]), Bi = new Uint8Array([
	16,
	16,
	16,
	16,
	17,
	17,
	18,
	18,
	19,
	19,
	20,
	20,
	21,
	21,
	22,
	22,
	23,
	23,
	24,
	24,
	25,
	25,
	26,
	26,
	27,
	27,
	28,
	28,
	29,
	29,
	64,
	64
]), Vi = (e, t, n, r, i, a, o, s) => {
	let c = s.bits, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y, b, x, S, C, w = null, T = 0, E, D = /* @__PURE__ */ new Uint16Array(16), O = /* @__PURE__ */ new Uint16Array(16), k = null, A = 0, j, ee, te;
	for (l = 0; l <= ji; l++) D[l] = 0;
	for (u = 0; u < r; u++) D[t[n + u]]++;
	for (p = c, f = ji; f >= 1 && D[f] === 0; f--);
	if (p > f && (p = f), f === 0) return i[a++] = 20971520, i[a++] = 20971520, s.bits = 1, 0;
	for (d = 1; d < f && D[d] === 0; d++);
	for (p < d && (p = d), g = 1, l = 1; l <= ji; l++) if (g <<= 1, g -= D[l], g < 0) return -1;
	if (g > 0 && (e === Pi || f !== 1)) return -1;
	for (O[1] = 0, l = 1; l < ji; l++) O[l + 1] = O[l] + D[l];
	for (u = 0; u < r; u++) t[n + u] !== 0 && (o[O[t[n + u]]++] = u);
	if (e === Pi ? (w = k = o, E = 19) : e === Fi ? (w = Li, T -= 257, k = Ri, A -= 257, E = 256) : (w = zi, k = Bi, E = -1), v = 0, u = 0, l = d, C = a, m = p, h = 0, x = -1, _ = 1 << p, S = _ - 1, e === Fi && _ > Mi || e === Ii && _ > Ni) return 1;
	for (;;) {
		j = l - h, o[u] < E ? (ee = 0, te = o[u]) : o[u] > E ? (ee = k[A + o[u]], te = w[T + o[u]]) : (ee = 96, te = 0), y = 1 << l - h, b = 1 << m, d = b;
		do
			b -= y, i[C + (v >> h) + b] = j << 24 | ee << 16 | te | 0;
		while (b !== 0);
		for (y = 1 << l - 1; v & y;) y >>= 1;
		if (y === 0 ? v = 0 : (v &= y - 1, v += y), u++, --D[l] === 0) {
			if (l === f) break;
			l = t[n + o[u]];
		}
		if (l > p && (v & S) !== x) {
			for (h === 0 && (h = p), C += d, m = l - h, g = 1 << m; m + h < f && (g -= D[m + h], !(g <= 0));) m++, g <<= 1;
			if (_ += 1 << m, e === Fi && _ > Mi || e === Ii && _ > Ni) return 1;
			x = v & S, i[x] = p << 24 | m << 16 | C - a | 0;
		}
	}
	return v !== 0 && (i[C + v] = l - h << 24 | 4194304), s.bits = p, 0;
}, Hi = 0, Ui = 1, Wi = 2, { Z_FINISH: Gi, Z_BLOCK: Ki, Z_TREES: qi, Z_OK: Ji, Z_STREAM_END: Yi, Z_NEED_DICT: Xi, Z_STREAM_ERROR: Zi, Z_DATA_ERROR: Qi, Z_MEM_ERROR: $i, Z_BUF_ERROR: ea, Z_DEFLATED: ta } = Gn, na = 1, ra = 2, ia = 3, aa = 4, oa = 5, sa = 6, ca = 7, la = 8, ua = 9, da = 10, fa = 11, pa = 12, ma = 13, ha = 14, ga = 15, _a = 16, va = 17, ya = 18, ba = 19, xa = 20, Sa = 21, Ca = 22, wa = 23, Ta = 24, Ea = 25, Da = 26, Oa = 27, ka = 28, Aa = 29, $ = 30, ja = 31, Ma = 32, Na = 852, Pa = 592, Fa = 15, Ia = (e) => (e >>> 24 & 255) + (e >>> 8 & 65280) + ((e & 65280) << 8) + ((e & 255) << 24);
function La() {
	this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = /* @__PURE__ */ new Uint16Array(320), this.work = /* @__PURE__ */ new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
var Ra = (e) => {
	if (!e || !e.state) return Zi;
	let t = e.state;
	return e.total_in = e.total_out = t.total = 0, e.msg = "", t.wrap && (e.adler = t.wrap & 1), t.mode = na, t.last = 0, t.havedict = 0, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(Na), t.distcode = t.distdyn = new Int32Array(Pa), t.sane = 1, t.back = -1, Ji;
}, za = (e) => {
	if (!e || !e.state) return Zi;
	let t = e.state;
	return t.wsize = 0, t.whave = 0, t.wnext = 0, Ra(e);
}, Ba = (e, t) => {
	let n;
	if (!e || !e.state) return Zi;
	let r = e.state;
	return t < 0 ? (n = 0, t = -t) : (n = (t >> 4) + 1, t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? Zi : (r.window !== null && r.wbits !== t && (r.window = null), r.wrap = n, r.wbits = t, za(e));
}, Va = (e, t) => {
	if (!e) return Zi;
	let n = new La();
	e.state = n, n.window = null;
	let r = Ba(e, t);
	return r !== Ji && (e.state = null), r;
}, Ha = (e) => Va(e, Fa), Ua = !0, Wa, Ga, Ka = (e) => {
	if (Ua) {
		Wa = /* @__PURE__ */ new Int32Array(512), Ga = /* @__PURE__ */ new Int32Array(32);
		let t = 0;
		for (; t < 144;) e.lens[t++] = 8;
		for (; t < 256;) e.lens[t++] = 9;
		for (; t < 280;) e.lens[t++] = 7;
		for (; t < 288;) e.lens[t++] = 8;
		for (Vi(Ui, e.lens, 0, 288, Wa, 0, e.work, { bits: 9 }), t = 0; t < 32;) e.lens[t++] = 5;
		Vi(Wi, e.lens, 0, 32, Ga, 0, e.work, { bits: 5 }), Ua = !1;
	}
	e.lencode = Wa, e.lenbits = 9, e.distcode = Ga, e.distbits = 5;
}, qa = (e, t, n, r) => {
	let i, a = e.state;
	return a.window === null && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new Uint8Array(a.wsize)), r >= a.wsize ? (a.window.set(t.subarray(n - a.wsize, n), 0), a.wnext = 0, a.whave = a.wsize) : (i = a.wsize - a.wnext, i > r && (i = r), a.window.set(t.subarray(n - r, n - r + i), a.wnext), r -= i, r ? (a.window.set(t.subarray(n - r, n), 0), a.wnext = r, a.whave = a.wsize) : (a.wnext += i, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += i))), 0;
}, Ja = {
	inflateReset: za,
	inflateReset2: Ba,
	inflateResetKeep: Ra,
	inflateInit: Ha,
	inflateInit2: Va,
	inflate: (e, t) => {
		let n, r, i, a, o, s, c, l, u, d, f, p, m, h, g = 0, _, v, y, b, x, S, C, w, T = /* @__PURE__ */ new Uint8Array(4), E, D, O = new Uint8Array([
			16,
			17,
			18,
			0,
			8,
			7,
			9,
			6,
			10,
			5,
			11,
			4,
			12,
			3,
			13,
			2,
			14,
			1,
			15
		]);
		if (!e || !e.state || !e.output || !e.input && e.avail_in !== 0) return Zi;
		n = e.state, n.mode === pa && (n.mode = ma), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, d = s, f = c, w = Ji;
		inf_leave: for (;;) switch (n.mode) {
			case na:
				if (n.wrap === 0) {
					n.mode = ma;
					break;
				}
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.wrap & 2 && l === 35615) {
					n.check = 0, T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = Un(n.check, T, 2, 0), l = 0, u = 0, n.mode = ra;
					break;
				}
				if (n.flags = 0, n.head && (n.head.done = !1), !(n.wrap & 1) || (((l & 255) << 8) + (l >> 8)) % 31) {
					e.msg = "incorrect header check", n.mode = $;
					break;
				}
				if ((l & 15) !== ta) {
					e.msg = "unknown compression method", n.mode = $;
					break;
				}
				if (l >>>= 4, u -= 4, C = (l & 15) + 8, n.wbits === 0) n.wbits = C;
				else if (C > n.wbits) {
					e.msg = "invalid window size", n.mode = $;
					break;
				}
				n.dmax = 1 << n.wbits, e.adler = n.check = 1, n.mode = l & 512 ? da : pa, l = 0, u = 0;
				break;
			case ra:
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.flags = l, (n.flags & 255) !== ta) {
					e.msg = "unknown compression method", n.mode = $;
					break;
				}
				if (n.flags & 57344) {
					e.msg = "unknown header flags set", n.mode = $;
					break;
				}
				n.head && (n.head.text = l >> 8 & 1), n.flags & 512 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = Un(n.check, T, 2, 0)), l = 0, u = 0, n.mode = ia;
			case ia:
				for (; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.head && (n.head.time = l), n.flags & 512 && (T[0] = l & 255, T[1] = l >>> 8 & 255, T[2] = l >>> 16 & 255, T[3] = l >>> 24 & 255, n.check = Un(n.check, T, 4, 0)), l = 0, u = 0, n.mode = aa;
			case aa:
				for (; u < 16;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				n.head && (n.head.xflags = l & 255, n.head.os = l >> 8), n.flags & 512 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = Un(n.check, T, 2, 0)), l = 0, u = 0, n.mode = oa;
			case oa:
				if (n.flags & 1024) {
					for (; u < 16;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.length = l, n.head && (n.head.extra_len = l), n.flags & 512 && (T[0] = l & 255, T[1] = l >>> 8 & 255, n.check = Un(n.check, T, 2, 0)), l = 0, u = 0;
				} else n.head && (n.head.extra = null);
				n.mode = sa;
			case sa:
				if (n.flags & 1024 && (p = n.length, p > s && (p = s), p && (n.head && (C = n.head.extra_len - n.length, n.head.extra || (n.head.extra = new Uint8Array(n.head.extra_len)), n.head.extra.set(r.subarray(a, a + p), C)), n.flags & 512 && (n.check = Un(n.check, r, p, a)), s -= p, a += p, n.length -= p), n.length)) break inf_leave;
				n.length = 0, n.mode = ca;
			case ca:
				if (n.flags & 2048) {
					if (s === 0) break inf_leave;
					p = 0;
					do
						C = r[a + p++], n.head && C && n.length < 65536 && (n.head.name += String.fromCharCode(C));
					while (C && p < s);
					if (n.flags & 512 && (n.check = Un(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
				} else n.head && (n.head.name = null);
				n.length = 0, n.mode = la;
			case la:
				if (n.flags & 4096) {
					if (s === 0) break inf_leave;
					p = 0;
					do
						C = r[a + p++], n.head && C && n.length < 65536 && (n.head.comment += String.fromCharCode(C));
					while (C && p < s);
					if (n.flags & 512 && (n.check = Un(n.check, r, p, a)), s -= p, a += p, C) break inf_leave;
				} else n.head && (n.head.comment = null);
				n.mode = ua;
			case ua:
				if (n.flags & 512) {
					for (; u < 16;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (l !== (n.check & 65535)) {
						e.msg = "header crc mismatch", n.mode = $;
						break;
					}
					l = 0, u = 0;
				}
				n.head && (n.head.hcrc = n.flags >> 9 & 1, n.head.done = !0), e.adler = n.check = 0, n.mode = pa;
				break;
			case da:
				for (; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				e.adler = n.check = Ia(l), l = 0, u = 0, n.mode = fa;
			case fa:
				if (n.havedict === 0) return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, Xi;
				e.adler = n.check = 1, n.mode = pa;
			case pa: if (t === Ki || t === qi) break inf_leave;
			case ma:
				if (n.last) {
					l >>>= u & 7, u -= u & 7, n.mode = Oa;
					break;
				}
				for (; u < 3;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				switch (n.last = l & 1, l >>>= 1, --u, l & 3) {
					case 0:
						n.mode = ha;
						break;
					case 1:
						if (Ka(n), n.mode = xa, t === qi) {
							l >>>= 2, u -= 2;
							break inf_leave;
						}
						break;
					case 2:
						n.mode = va;
						break;
					case 3: e.msg = "invalid block type", n.mode = $;
				}
				l >>>= 2, u -= 2;
				break;
			case ha:
				for (l >>>= u & 7, u -= u & 7; u < 32;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if ((l & 65535) != (l >>> 16 ^ 65535)) {
					e.msg = "invalid stored block lengths", n.mode = $;
					break;
				}
				if (n.length = l & 65535, l = 0, u = 0, n.mode = ga, t === qi) break inf_leave;
			case ga: n.mode = _a;
			case _a:
				if (p = n.length, p) {
					if (p > s && (p = s), p > c && (p = c), p === 0) break inf_leave;
					i.set(r.subarray(a, a + p), o), s -= p, a += p, c -= p, o += p, n.length -= p;
					break;
				}
				n.mode = pa;
				break;
			case va:
				for (; u < 14;) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (n.nlen = (l & 31) + 257, l >>>= 5, u -= 5, n.ndist = (l & 31) + 1, l >>>= 5, u -= 5, n.ncode = (l & 15) + 4, l >>>= 4, u -= 4, n.nlen > 286 || n.ndist > 30) {
					e.msg = "too many length or distance symbols", n.mode = $;
					break;
				}
				n.have = 0, n.mode = ya;
			case ya:
				for (; n.have < n.ncode;) {
					for (; u < 3;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.lens[O[n.have++]] = l & 7, l >>>= 3, u -= 3;
				}
				for (; n.have < 19;) n.lens[O[n.have++]] = 0;
				if (n.lencode = n.lendyn, n.lenbits = 7, E = { bits: n.lenbits }, w = Vi(Hi, n.lens, 0, 19, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
					e.msg = "invalid code lengths set", n.mode = $;
					break;
				}
				n.have = 0, n.mode = ba;
			case ba:
				for (; n.have < n.nlen + n.ndist;) {
					for (; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (y < 16) l >>>= _, u -= _, n.lens[n.have++] = y;
					else {
						if (y === 16) {
							for (D = _ + 2; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							if (l >>>= _, u -= _, n.have === 0) {
								e.msg = "invalid bit length repeat", n.mode = $;
								break;
							}
							C = n.lens[n.have - 1], p = 3 + (l & 3), l >>>= 2, u -= 2;
						} else if (y === 17) {
							for (D = _ + 3; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							l >>>= _, u -= _, C = 0, p = 3 + (l & 7), l >>>= 3, u -= 3;
						} else {
							for (D = _ + 7; u < D;) {
								if (s === 0) break inf_leave;
								s--, l += r[a++] << u, u += 8;
							}
							l >>>= _, u -= _, C = 0, p = 11 + (l & 127), l >>>= 7, u -= 7;
						}
						if (n.have + p > n.nlen + n.ndist) {
							e.msg = "invalid bit length repeat", n.mode = $;
							break;
						}
						for (; p--;) n.lens[n.have++] = C;
					}
				}
				if (n.mode === $) break;
				if (n.lens[256] === 0) {
					e.msg = "invalid code -- missing end-of-block", n.mode = $;
					break;
				}
				if (n.lenbits = 9, E = { bits: n.lenbits }, w = Vi(Ui, n.lens, 0, n.nlen, n.lencode, 0, n.work, E), n.lenbits = E.bits, w) {
					e.msg = "invalid literal/lengths set", n.mode = $;
					break;
				}
				if (n.distbits = 6, n.distcode = n.distdyn, E = { bits: n.distbits }, w = Vi(Wi, n.lens, n.nlen, n.ndist, n.distcode, 0, n.work, E), n.distbits = E.bits, w) {
					e.msg = "invalid distances set", n.mode = $;
					break;
				}
				if (n.mode = xa, t === qi) break inf_leave;
			case xa: n.mode = Sa;
			case Sa:
				if (s >= 6 && c >= 258) {
					e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, Ai(e, f), o = e.next_out, i = e.output, c = e.avail_out, a = e.next_in, r = e.input, s = e.avail_in, l = n.hold, u = n.bits, n.mode === pa && (n.back = -1);
					break;
				}
				for (n.back = 0; g = n.lencode[l & (1 << n.lenbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (v && !(v & 240)) {
					for (b = _, x = v, S = y; g = n.lencode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					l >>>= b, u -= b, n.back += b;
				}
				if (l >>>= _, u -= _, n.back += _, n.length = y, v === 0) {
					n.mode = Da;
					break;
				}
				if (v & 32) {
					n.back = -1, n.mode = pa;
					break;
				}
				if (v & 64) {
					e.msg = "invalid literal/length code", n.mode = $;
					break;
				}
				n.extra = v & 15, n.mode = Ca;
			case Ca:
				if (n.extra) {
					for (D = n.extra; u < D;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.length += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
				}
				n.was = n.length, n.mode = wa;
			case wa:
				for (; g = n.distcode[l & (1 << n.distbits) - 1], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(_ <= u);) {
					if (s === 0) break inf_leave;
					s--, l += r[a++] << u, u += 8;
				}
				if (!(v & 240)) {
					for (b = _, x = v, S = y; g = n.distcode[S + ((l & (1 << b + x) - 1) >> b)], _ = g >>> 24, v = g >>> 16 & 255, y = g & 65535, !(b + _ <= u);) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					l >>>= b, u -= b, n.back += b;
				}
				if (l >>>= _, u -= _, n.back += _, v & 64) {
					e.msg = "invalid distance code", n.mode = $;
					break;
				}
				n.offset = y, n.extra = v & 15, n.mode = Ta;
			case Ta:
				if (n.extra) {
					for (D = n.extra; u < D;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					n.offset += l & (1 << n.extra) - 1, l >>>= n.extra, u -= n.extra, n.back += n.extra;
				}
				if (n.offset > n.dmax) {
					e.msg = "invalid distance too far back", n.mode = $;
					break;
				}
				n.mode = Ea;
			case Ea:
				if (c === 0) break inf_leave;
				if (p = f - c, n.offset > p) {
					if (p = n.offset - p, p > n.whave && n.sane) {
						e.msg = "invalid distance too far back", n.mode = $;
						break;
					}
					p > n.wnext ? (p -= n.wnext, m = n.wsize - p) : m = n.wnext - p, p > n.length && (p = n.length), h = n.window;
				} else h = i, m = o - n.offset, p = n.length;
				p > c && (p = c), c -= p, n.length -= p;
				do
					i[o++] = h[m++];
				while (--p);
				n.length === 0 && (n.mode = Sa);
				break;
			case Da:
				if (c === 0) break inf_leave;
				i[o++] = n.length, c--, n.mode = Sa;
				break;
			case Oa:
				if (n.wrap) {
					for (; u < 32;) {
						if (s === 0) break inf_leave;
						s--, l |= r[a++] << u, u += 8;
					}
					if (f -= c, e.total_out += f, n.total += f, f && (e.adler = n.check = n.flags ? Un(n.check, i, f, o - f) : Vn(n.check, i, f, o - f)), f = c, (n.flags ? l : Ia(l)) !== n.check) {
						e.msg = "incorrect data check", n.mode = $;
						break;
					}
					l = 0, u = 0;
				}
				n.mode = ka;
			case ka:
				if (n.wrap && n.flags) {
					for (; u < 32;) {
						if (s === 0) break inf_leave;
						s--, l += r[a++] << u, u += 8;
					}
					if (l !== (n.total & 4294967295)) {
						e.msg = "incorrect length check", n.mode = $;
						break;
					}
					l = 0, u = 0;
				}
				n.mode = Aa;
			case Aa:
				w = Yi;
				break inf_leave;
			case $:
				w = Qi;
				break inf_leave;
			case ja: return $i;
			case Ma:
			default: return Zi;
		}
		return e.next_out = o, e.avail_out = c, e.next_in = a, e.avail_in = s, n.hold = l, n.bits = u, (n.wsize || f !== e.avail_out && n.mode < $ && (n.mode < Oa || t !== Gi)) && qa(e, e.output, e.next_out, f - e.avail_out), d -= e.avail_in, f -= e.avail_out, e.total_in += d, e.total_out += f, n.total += f, n.wrap && f && (e.adler = n.check = n.flags ? Un(n.check, i, f, e.next_out - f) : Vn(n.check, i, f, e.next_out - f)), e.data_type = n.bits + (n.last ? 64 : 0) + (n.mode === pa ? 128 : 0) + (n.mode === xa || n.mode === ga ? 256 : 0), (d === 0 && f === 0 || t === Gi) && w === Ji && (w = ea), w;
	},
	inflateEnd: (e) => {
		if (!e || !e.state) return Zi;
		let t = e.state;
		return t.window &&= null, e.state = null, Ji;
	},
	inflateGetHeader: (e, t) => {
		if (!e || !e.state) return Zi;
		let n = e.state;
		return n.wrap & 2 ? (n.head = t, t.done = !1, Ji) : Zi;
	},
	inflateSetDictionary: (e, t) => {
		let n = t.length, r, i, a;
		return !e || !e.state || (r = e.state, r.wrap !== 0 && r.mode !== fa) ? Zi : r.mode === fa && (i = 1, i = Vn(i, t, n, 0), i !== r.check) ? Qi : (a = qa(e, t, n, n), a ? (r.mode = ja, $i) : (r.havedict = 1, Ji));
	},
	inflateInfo: "pako inflate (from Nodeca project)"
};
function Ya() {
	this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Xa = Ya, Za = Object.prototype.toString, { Z_NO_FLUSH: Qa, Z_FINISH: $a, Z_OK: eo, Z_STREAM_END: to, Z_NEED_DICT: no, Z_STREAM_ERROR: ro, Z_DATA_ERROR: io, Z_MEM_ERROR: ao } = Gn;
function oo(e) {
	this.options = ai.assign({
		chunkSize: 65536,
		windowBits: 15,
		to: ""
	}, e || {});
	let t = this.options;
	t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, t.windowBits === 0 && (t.windowBits = -15)), t.windowBits >= 0 && t.windowBits < 16 && !(e && e.windowBits) && (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && (t.windowBits & 15 || (t.windowBits |= 15)), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new fi(), this.strm.avail_out = 0;
	let n = Ja.inflateInit2(this.strm, t.windowBits);
	if (n !== eo || (this.header = new Xa(), Ja.inflateGetHeader(this.strm, this.header), t.dictionary && (typeof t.dictionary == "string" ? t.dictionary = ui.string2buf(t.dictionary) : Za.call(t.dictionary) === "[object ArrayBuffer]" && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (n = Ja.inflateSetDictionary(this.strm, t.dictionary), n !== eo)))) throw Error(Wn[n]);
}
oo.prototype.push = function(e, t) {
	let n = this.strm, r = this.options.chunkSize, i = this.options.dictionary, a, o, s;
	if (this.ended) return !1;
	for (o = t === ~~t ? t : t === !0 ? $a : Qa, n.input = Za.call(e) === "[object ArrayBuffer]" ? new Uint8Array(e) : e, n.next_in = 0, n.avail_in = n.input.length;;) {
		for (n.avail_out === 0 && (n.output = new Uint8Array(r), n.next_out = 0, n.avail_out = r), a = Ja.inflate(n, o), a === no && i && (a = Ja.inflateSetDictionary(n, i), a === eo ? a = Ja.inflate(n, o) : a === io && (a = no)); n.avail_in > 0 && a === to && n.state.wrap > 0 && e[n.next_in] !== 0;) Ja.inflateReset(n), a = Ja.inflate(n, o);
		switch (a) {
			case ro:
			case io:
			case no:
			case ao: return this.onEnd(a), this.ended = !0, !1;
		}
		if (s = n.avail_out, n.next_out && (n.avail_out === 0 || a === to)) {
			if (this.options.to === "string") {
				let e = ui.utf8border(n.output, n.next_out), t = n.next_out - e, i = ui.buf2string(n.output, e);
				n.next_out = t, n.avail_out = r - t, t && n.output.set(n.output.subarray(e, e + t), 0), this.onData(i);
			} else this.onData(n.output.length === n.next_out ? n.output : n.output.subarray(0, n.next_out));
		}
		if (a !== eo || s !== 0) {
			if (a === to) return a = Ja.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
			if (n.avail_in === 0) break;
		}
	}
	return !0;
}, oo.prototype.onData = function(e) {
	this.chunks.push(e);
}, oo.prototype.onEnd = function(e) {
	e === eo && (this.result = this.options.to === "string" ? this.chunks.join("") : ai.flattenChunks(this.chunks)), this.chunks = [], this.err = e, this.msg = this.strm.msg;
};
function so(e, t) {
	let n = new oo(t);
	if (n.push(e), n.err) throw n.msg || Wn[n.err];
	return n.result;
}
function co(e, t) {
	return t ||= {}, t.raw = !0, so(e, t);
}
var lo = {
	Inflate: oo,
	inflate: so,
	inflateRaw: co,
	ungzip: so,
	constants: Gn
}, { Deflate: uo, deflate: fo, deflateRaw: po, gzip: mo } = Di, { Inflate: ho, inflate: go, inflateRaw: _o, ungzip: vo } = lo, yo = {
	Deflate: uo,
	deflate: fo,
	deflateRaw: po,
	gzip: mo,
	Inflate: ho,
	inflate: go,
	inflateRaw: _o,
	ungzip: vo,
	constants: Gn
}, bo = (e) => {
	let t = (Number(e) - ne) / re;
	return new Date(t + -108e5);
};
//#endregion
//#region packages/core/src/lib/client/helpers/getBitsFrom.ts
function xo(e, t) {
	return !!(e & 1 << t);
}
//#endregion
//#region packages/core/src/lib/client/helpers/getMaskBytesArray.ts
var So = (e, t, n) => {
	let r = t % 8, i = ~~(t / 8);
	r > 0 && (i += 1);
	let a = new ArrayBuffer(i), o = new Uint8Array(a);
	for (let t = 0; t < i; t++) o[t] = e.getUint8(n + t);
	return o;
};
//#endregion
//#region packages/core/src/lib/client/serialization/decode/decodeMaskedEntity.ts
function Co(e, t, n, r) {
	let i = t, a = e.getUint8(i);
	i += 1;
	let o = So(e, a, i);
	i += o.byteLength;
	let s = 0, c = 0, l = 0;
	for (let t of Object.keys(n)) c >= a || (xo(o[~~(s / 8)], l) && (i += Do(e, t, n[t], r, i)), l === 7 ? l = 0 : l += 1, s += 1, c += 1);
	return i;
}
//#endregion
//#region packages/core/src/lib/client/serialization/decode/decodeNewArrayField.ts
function wo(e, t, n, r, i) {
	let a = ae(n.elements);
	if (!a) return c.default.error(te + `type = ${n.elements})`), 0;
	let o = ce(n.elements), s = t;
	if (s + 2 > e.byteOffset + e.byteLength) return c.default.error("decodeNewArrayField: not enough data for array size"), 0;
	let l = e.getUint16(s, !0);
	s += 2, r[i] = [];
	for (let t = 0; t < l; t++) {
		if (s + 2 > e.byteOffset + e.byteLength) {
			c.default.error("decodeNewArrayField: not enough data for element %d size, offset=%d, byteEnd=%d", t, s, e.byteOffset + e.byteLength);
			break;
		}
		let l = e.getUint16(s, !0);
		s += 2;
		let u = oe(n.elements);
		if (o) {
			let n = e.byteOffset + e.byteLength - s, r = Math.min(l, n), i = new DataView(e.buffer, e.byteOffset + s, r);
			try {
				let e = Co(i, 0, a, u);
				s += e;
			} catch (e) {
				c.default.debug("element %d: masked decode error (ignored): %s", t, e), s += r;
			}
		} else for (let t of Object.keys(a)) s += Do(e, t, a[t], u, s);
		if (!n.isPrimitives) r[i].push(u);
		else {
			let e = Object.keys(u)[0];
			r[i].push(u[e]);
		}
	}
	return s - t;
}
//#endregion
//#region packages/core/src/lib/client/serialization/decode/decodeVariantField.ts
function To(e, t, n, r, i, a) {
	switch (e.getInt8(i)) {
		case 1: return a(e, t, { type: h.Int32Field }, r, i + 1) + 1;
		case 5: return a(e, t, { type: h.UInt32Field }, r, i + 1) + 1;
		case 8: return a(e, t, { type: h.Int16Field }, r, i + 1) + 1;
	}
	return c.default.debug("Not implemented variant type"), 1;
}
//#endregion
//#region packages/core/src/lib/client/serialization/decode/decodeField.ts
var Eo = new TextDecoder();
function Do(e, t, n, r, i) {
	switch (n.type) {
		case h.ConditionField: return Do(e, t, n.condition(r), r, i);
		case h.EnumField: {
			let a = n, o = 0;
			return a.width === 1 ? o = e.getInt8(i) : a.width === 2 ? o = e.getInt16(i, !0) : a.width === 4 ? o = e.getInt32(i, !0) : a.width === 8 ? o = e.getBigInt64(i, !0) : c.default.error("Unsupported enum width"), r[t] = o, a.width;
		}
		case h.Int8Field: return r[t] = e.getInt8(i), 1;
		case h.Int16Field: return r[t] = e.getInt16(i, !0), 2;
		case h.Int32Field: return r[t] = e.getInt32(i, !0), 4;
		case h.UInt32Field: return r[t] = e.getUint32(i, !0), 4;
		case h.Int64Field: return r[t] = e.getBigInt64(i, !0), 8;
		case h.DateTimeFiled: return r[t] = bo(e.getBigInt64(i, !0)), 8;
		case h.UnknownField: return n.width;
		case h.StringField: {
			if (e.getInt8(i) === 0) return 1;
			let n = e.getUint16(i + 1, !0);
			if (n === 0) return r[t] = "", 3;
			let a = new DataView(e.buffer, e.byteOffset + i + 3, n);
			try {
				r[t] = Eo.decode(a);
			} catch (e) {
				c.default.error(e);
			}
			return n + 3;
		}
		case h.BooleanField: return r[t] = e.getUint8(i) === 1, 1;
		case h.DoubleField: return r[t] = parseFloat(e.getFloat64(i, !0).toPrecision(12)), 8;
		case h.ByteArrayField: {
			let n = i, a = e.getInt8(i);
			if (n += 1, a === 0) return 1;
			let o = e.getInt16(n, !0);
			return n += 2, r[t] = e.buffer.slice(e.byteOffset + n, e.byteOffset + n + o), n += o, n - i;
		}
		case h.VariantField: return To(e, t, n, r, i, Do);
		case h.NewArrayField: return wo(e, i, n, r, t);
		case h.ArrayField: {
			let a = i, o = e.getInt8(i);
			if (a += 1, o === 0) return 1;
			let s = e.getInt16(a, !0);
			a += 2;
			let l = n, u = ae(l.elements);
			if (!u) return c.default.error(te + `type = ${l.elements})`), a;
			r[t] = [];
			for (let n = 0; n < s; n++) {
				let n = oe(l.elements);
				for (let t of Object.keys(u)) a += Do(e, t, u[t], n, a);
				if (!l.isPrimitives) r[t].push(n);
				else {
					let e = Object.keys(n)[0];
					r[t].push(n[e]);
				}
			}
			return a - i;
		}
	}
	return 0;
}
//#endregion
//#region packages/core/src/lib/client/serialization/decode/decodeEntity.ts
function Oo(e, t) {
	let n = e.getInt16(t + 2, !0), r = e.getUint16(t, !0);
	c.default.trace(`decoding entity type=${n} and size=${r}`);
	let i = se(n);
	if (!i) throw Error(te + `type = ${n}`);
	let a = oe(i), o = ae(i);
	if (!o) throw Error(te + `type = ${i}`);
	let s = t + 4, l = ce(n);
	if (l && e.getUint8(s) === 0 && (s += 1, l = !1), l) s = Co(e, s, o, a);
	else for (let n of Object.keys(o)) s >= r + t || (s += Do(e, n, o[n], a, s));
	return [n, a];
}
//#endregion
//#region packages/core/src/lib/client/serialization/decode/decodeMessageBody.ts
function ko(e, t, n) {
	let r = e.getUint16(t, !0), i = e.getInt16(t + 2, !0), a = se(i);
	if (r + 4 === n) {
		let n = {
			type: ue,
			data: {}
		};
		try {
			if (a !== void 0) return n = {
				type: a,
				data: Oo(e, t)[1]
			}, n;
		} catch (e) {
			c.default.error(e);
		} finally {
			return n;
		}
	}
	{
		let o = t, s = r, l = [], u = {
			type: a,
			data: []
		}, d = u, f = i;
		for (l.push(u); o + s <= n;) {
			try {
				let t = Oo(e, o);
				t[0] === f ? d.data.push(t[1]) : (d = {
					type: se(t[0]) || ue,
					data: [t[1]]
				}, l.push(d), f = t[0]);
			} catch (e) {
				if (c.default.error(e), s === 0) break;
			}
			if (o + s === n) break;
			o += s, s = e.getUint16(o, !0);
		}
		return l;
	}
}
//#endregion
//#region packages/core/src/lib/client/serialization/decode/decodeArchive.ts
function Ao(e) {
	let t = new Uint8Array(e, 4);
	try {
		let e = yo.inflate(t);
		if (!e) throw Error("Corrupted archived message body");
		let n = new Pt(e.buffer), r = n.getUint16(2, !0);
		return (se(r) || ue) === ue && c.default.debug(`Unknown entity with type ${r} inside archive recieved`), ko(n, 0, e.buffer.byteLength);
	} catch (e) {
		return c.default.error(e), {
			type: ue,
			data: {}
		};
	}
}
//#endregion
//#region packages/core/src/lib/client/serialization/decode/decode.ts
var jo = 4;
function Mo(e) {
	let t = new Pt(e), n = t.getInt8(3) !== 0, r = t.getInt16(6, !0);
	return n ? Ao(t.buffer) : ((se(r) || ue) === ue && c.default.debug(`Unknown entity with type ${r} recieved`), ko(t, jo, t.byteLength));
}
//#endregion
//#region packages/core/src/lib/client/serialization/StreamDecoder.ts
var No = class {
	messagePending;
	bytesRead;
	packetBuffer;
	currentMessageLength;
	panicMode;
	constructor() {
		this.bytesRead = 0, this.messagePending = !1, this.packetBuffer = [], this.currentMessageLength = 0, this.panicMode = !1;
	}
	get pendingByteLength() {
		return this.messagePending ? this.bytesRead : 0;
	}
	getFramingRemainder() {
		if (!this.messagePending) return { kind: "aligned" };
		if (!this.panicMode) return {
			kind: "body",
			remainingBytes: this.currentMessageLength - this.bytesRead
		};
		let e = [];
		for (let t of this.packetBuffer) e.push(...new Uint8Array(t));
		return {
			kind: "header",
			prefix: e
		};
	}
	decodeMessages(e) {
		let t = [];
		for (let n = 0; n < e.length; n++) {
			let r;
			try {
				r = Mo(e[n]);
			} catch {
				let t = e[n].byteLength < 100 ? `Hex: ${l(e[n])}` : `ByteLength: ${e[n].byteLength}`;
				c.default.error(`Broken entity. ${t}`);
				continue;
			}
			if (r) {
				if (Array.isArray(r)) {
					if (r.length === 0) continue;
					r.length === 1 ? t.push(r[0]) : Array.prototype.push.apply(t, r);
				} else t.push(r);
			}
		}
		return t;
	}
	getMessagesFromStream(e) {
		let t = new Uint8Array(e), n = [];
		if (this.panicMode) {
			if (this.bytesRead + t.length < 3) return this.bytesRead += t.length, this.packetBuffer.push(e), n;
			let r = new Uint8Array(this.bytesRead + t.length), i = 0;
			for (let e of this.packetBuffer) {
				let t = new Uint8Array(e);
				r.set(t, i), i += t.length;
			}
			r.set(t, i);
			let a = new Pt(r.buffer);
			this.packetBuffer = [r.buffer], this.bytesRead = r.byteLength, this.currentMessageLength = a.getUint24(0), this.panicMode = !1;
		} else this.bytesRead += t.byteLength, this.packetBuffer.push(e);
		if (this.messagePending === !1) {
			if (this.messagePending = !0, this.packetBuffer = [t.buffer], this.bytesRead = t.byteLength, t.byteLength >= 3) {
				let t = new Pt(e);
				this.currentMessageLength = t.getUint24(0);
			} else return this.panicMode = !0, n;
		}
		if (this.bytesRead === this.currentMessageLength) this.messagePending = !1, n.push(this.flattenBufferQueue(this.packetBuffer));
		else if (this.bytesRead >= this.currentMessageLength) return this.reduceMessageBufferTail(this.flattenBufferQueue(this.packetBuffer));
		return n;
	}
	processBufferStream(e) {
		try {
			let t = this.getMessagesFromStream(e);
			return this.decodeMessages(t);
		} catch (t) {
			throw Error(`${t}\n
          bytesRead: ${this.bytesRead}\n,
          buffer: ${new Uint8Array(e).join(", ")}`);
		}
	}
	reduceMessageBufferTail(e) {
		this.packetBuffer = [];
		let t = new Pt(e), n = [], r = 0;
		for (; e.byteLength - r >= this.currentMessageLength;) {
			if (this.currentMessageLength < 3) throw Error(`Invalid message length: ${this.currentMessageLength}`);
			let i = r + this.currentMessageLength, a = e.slice(r, i);
			if (n.push(a), this.bytesRead -= a.byteLength, r = i, this.bytesRead === 0) break;
			if (this.bytesRead < 3) {
				this.panicMode = !0;
				break;
			}
			this.currentMessageLength = t.getUint24(r);
		}
		return this.bytesRead === 0 ? this.messagePending = !1 : (this.messagePending = !0, this.packetBuffer.push(e.slice(r))), n;
	}
	flattenBufferQueue(e) {
		if (e.length === 1) return e[0];
		{
			let t = e.reduce((e, t) => e + t.byteLength, 0), n = new Uint8Array(t), r = 0;
			for (let e of this.packetBuffer) n.set(new Uint8Array(e), r), r += e.byteLength;
			return n.buffer;
		}
	}
}, Po = (e, t) => t.some((t) => e instanceof t), Fo, Io;
function Lo() {
	return Fo ||= [
		IDBDatabase,
		IDBObjectStore,
		IDBIndex,
		IDBCursor,
		IDBTransaction
	];
}
function Ro() {
	return Io ||= [
		IDBCursor.prototype.advance,
		IDBCursor.prototype.continue,
		IDBCursor.prototype.continuePrimaryKey
	];
}
var zo = /* @__PURE__ */ new WeakMap(), Bo = /* @__PURE__ */ new WeakMap(), Vo = /* @__PURE__ */ new WeakMap(), Ho = /* @__PURE__ */ new WeakMap(), Uo = /* @__PURE__ */ new WeakMap();
function Wo(e) {
	let t = new Promise((t, n) => {
		let r = () => {
			e.removeEventListener("success", i), e.removeEventListener("error", a);
		}, i = () => {
			t(Xo(e.result)), r();
		}, a = () => {
			n(e.error), r();
		};
		e.addEventListener("success", i), e.addEventListener("error", a);
	});
	return t.then((t) => {
		t instanceof IDBCursor && zo.set(t, e);
	}).catch(() => {}), Uo.set(t, e), t;
}
function Go(e) {
	if (Bo.has(e)) return;
	let t = new Promise((t, n) => {
		let r = () => {
			e.removeEventListener("complete", i), e.removeEventListener("error", a), e.removeEventListener("abort", a);
		}, i = () => {
			t(), r();
		}, a = () => {
			n(e.error || new DOMException("AbortError", "AbortError")), r();
		};
		e.addEventListener("complete", i), e.addEventListener("error", a), e.addEventListener("abort", a);
	});
	Bo.set(e, t);
}
var Ko = {
	get(e, t, n) {
		if (e instanceof IDBTransaction) {
			if (t === "done") return Bo.get(e);
			if (t === "objectStoreNames") return e.objectStoreNames || Vo.get(e);
			if (t === "store") return n.objectStoreNames[1] ? void 0 : n.objectStore(n.objectStoreNames[0]);
		}
		return Xo(e[t]);
	},
	set(e, t, n) {
		return e[t] = n, !0;
	},
	has(e, t) {
		return e instanceof IDBTransaction && (t === "done" || t === "store") || t in e;
	}
};
function qo(e) {
	Ko = e(Ko);
}
function Jo(e) {
	return e === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype) ? function(t, ...n) {
		let r = e.call(Zo(this), t, ...n);
		return Vo.set(r, t.sort ? t.sort() : [t]), Xo(r);
	} : Ro().includes(e) ? function(...t) {
		return e.apply(Zo(this), t), Xo(zo.get(this));
	} : function(...t) {
		return Xo(e.apply(Zo(this), t));
	};
}
function Yo(e) {
	return typeof e == "function" ? Jo(e) : (e instanceof IDBTransaction && Go(e), Po(e, Lo()) ? new Proxy(e, Ko) : e);
}
function Xo(e) {
	if (e instanceof IDBRequest) return Wo(e);
	if (Ho.has(e)) return Ho.get(e);
	let t = Yo(e);
	return t !== e && (Ho.set(e, t), Uo.set(t, e)), t;
}
var Zo = (e) => Uo.get(e);
//#endregion
//#region node_modules/.pnpm/idb@7.1.1/node_modules/idb/build/index.js
function Qo(e, t, { blocked: n, upgrade: r, blocking: i, terminated: a } = {}) {
	let o = indexedDB.open(e, t), s = Xo(o);
	return r && o.addEventListener("upgradeneeded", (e) => {
		r(Xo(o.result), e.oldVersion, e.newVersion, Xo(o.transaction), e);
	}), n && o.addEventListener("blocked", (e) => n(e.oldVersion, e.newVersion, e)), s.then((e) => {
		a && e.addEventListener("close", () => a()), i && e.addEventListener("versionchange", (e) => i(e.oldVersion, e.newVersion, e));
	}).catch(() => {}), s;
}
var $o = [
	"get",
	"getKey",
	"getAll",
	"getAllKeys",
	"count"
], es = [
	"put",
	"add",
	"delete",
	"clear"
], ts = /* @__PURE__ */ new Map();
function ns(e, t) {
	if (!(e instanceof IDBDatabase && !(t in e) && typeof t == "string")) return;
	if (ts.get(t)) return ts.get(t);
	let n = t.replace(/FromIndex$/, ""), r = t !== n, i = es.includes(n);
	if (!(n in (r ? IDBIndex : IDBObjectStore).prototype) || !(i || $o.includes(n))) return;
	let a = async function(e, ...t) {
		let a = this.transaction(e, i ? "readwrite" : "readonly"), o = a.store;
		return r && (o = o.index(t.shift())), (await Promise.all([o[n](...t), i && a.done]))[0];
	};
	return ts.set(t, a), a;
}
qo((e) => ({
	...e,
	get: (t, n, r) => ns(t, n) || e.get(t, n, r),
	has: (t, n) => !!ns(t, n) || e.has(t, n)
}));
//#endregion
//#region packages/core/src/lib/services/debugTools/feTable/search.ts
var rs = class {
	filter;
	path;
	constructor(e) {
		this.filter = e, this.path = e.field.replace(/\[\]/g, ".*").split(".").filter(Boolean);
	}
	test(e, t, n = 0) {
		let { filter: r, path: i } = this;
		if (!(!i.length || (i.length > 1 ? t.length - n === i.length && i.every((e, r) => e === "*" || e === t[n + r]) : t[t.length - 1] === i[0]))) return !1;
		if (r.field && r.operator === "exists") return !0;
		if (typeof e == "object" && e) return !1;
		let a = String(e);
		return r.operator === "equals" ? a === r.value : a.toLocaleLowerCase().includes(r.value.toLocaleLowerCase());
	}
};
function is(e, t) {
	if (!t.field && !t.value) return !0;
	let n = new rs(t), r = !1;
	function i(e, t) {
		if (!r) {
			if (n.test(e, t)) {
				r = !0;
				return;
			}
			if (typeof e == "object" && e) {
				for (let [n, a] of Object.entries(e)) if (i(a, [...t, n]), r) break;
			}
		}
	}
	return i(JSON.parse(e), []), r;
}
//#endregion
//#region packages/core/src/lib/services/debugTools/feTable/types.ts
var as = 2147483648, os = 134217728;
//#endregion
//#region packages/core/src/lib/services/debugTools/feTable/database.ts
async function ss(e = "terminal-fe-debug") {
	return Qo(e, 1, { upgrade(e) {
		e.createObjectStore("sessions", { keyPath: "id" });
		let t = e.createObjectStore("messages", { keyPath: ["sessionId", "seq"] });
		t.createIndex("time", [
			"sessionId",
			"at",
			"seq"
		]), t.createIndex("entityTime", [
			"sessionId",
			"entity",
			"at",
			"seq"
		]), e.createObjectStore("meta");
	} });
}
var cs = class {
	db;
	limit;
	exportRecord;
	sessionLocks = /* @__PURE__ */ new Map();
	constructor(e, t = as) {
		this.db = e, this.limit = t;
	}
	async holdLock(e, t = "exclusive") {
		return navigator.locks ? new Promise((n, r) => {
			navigator.locks.request(e, {
				mode: t,
				ifAvailable: !0
			}, async (e) => {
				if (!e) {
					r(/* @__PURE__ */ Error("История FE занята: сначала остановите запись во всех вкладках"));
					return;
				}
				await new Promise((e) => n(e));
			}).catch(r);
		}) : () => void 0;
	}
	async createSession(e, t) {
		let n = {
			id: e,
			startedAt: Date.now(),
			count: 0,
			bytes: 0,
			origin: t
		}, r = await this.holdLock(`terminal-fe-history:${this.db.name}`, "shared"), i;
		try {
			i = await this.holdLock(`terminal-fe-session:${e}`), await this.db.add("sessions", n), this.sessionLocks.set(e, () => {
				i?.(), r();
			});
		} catch (e) {
			throw i?.(), r(), e;
		}
		return n;
	}
	async append(e, t, n) {
		let r = await this.db.transaction([
			"sessions",
			"messages",
			"meta"
		], "readwrite");
		r.done.catch(() => void 0);
		let i = await r.objectStore("sessions").get(e), a = await r.objectStore("meta").get("bytes") ?? 0, o = t.reduce((e, t) => e + t.bytes, 0), s = await r.objectStore("meta").get(`transfer:${e}`) ?? 0;
		if (i && n !== void 0 && n <= s) return await r.done, i;
		if (n !== void 0 && n !== s + 1) throw r.abort(), await r.done.catch(() => void 0), Error("Нарушен порядок пачек FE");
		if (!i || i.endedAt || a + o > this.limit) throw r.abort(), await r.done.catch(() => void 0), Error("Запись остановлена: превышен лимит истории или сеанс закрыт");
		let c = t.map((t) => (i.count++, r.objectStore("messages").add({
			...t,
			sessionId: e,
			seq: i.count
		})));
		return await Promise.all(c), i.bytes += o, await r.objectStore("sessions").put(i), await r.objectStore("meta").put(a + o, "bytes"), n !== void 0 && await r.objectStore("meta").put(n, `transfer:${e}`), await r.done, i;
	}
	async finish(e, t) {
		try {
			let n = await this.db.transaction("sessions", "readwrite");
			n.done.catch(() => void 0);
			let r = await n.store.get(e);
			r && (r.endedAt = Date.now(), r.error = t ?? r.error, await n.store.put(r)), await n.done;
		} finally {
			this.sessionLocks.get(e)?.(), this.sessionLocks.delete(e);
		}
	}
	async markPartialStart(e) {
		let t = await this.db.transaction("sessions", "readwrite"), n = await t.store.get(e);
		return n && (n.partialStart = !0, await t.store.put(n)), await t.done, n;
	}
	async recoverInterrupted() {
		if (!navigator.locks) return;
		let e, t;
		do {
			t = await this.sessions(e);
			for (let e of t) e.endedAt || await navigator.locks.request(`terminal-fe-session:${e.id}`, { ifAvailable: !0 }, async (t) => {
				if (t) {
					let t = await this.db.get("sessions", e.id);
					t && !t.endedAt && await this.finish(e.id, "Запись прервана при закрытии или сбое расширения");
				}
			});
			e = t[t.length - 1]?.id;
		} while (t.length === 100);
	}
	async sessions(e) {
		let t = [], n = await (await this.db.transaction("sessions")).store.openCursor(e ? IDBKeyRange.upperBound(e, !0) : null, "prev");
		for (; n && t.length < 100;) t.push(n.value), n = await n.continue();
		return t;
	}
	async page(e, t, n = Infinity, r = () => !1, i = 100, a = !1) {
		let o = e.entity.trim(), s = o ? [
			e.sessionId,
			o,
			e.from,
			0
		] : [
			e.sessionId,
			e.from,
			0
		], c = o ? [
			e.sessionId,
			o,
			e.to,
			Infinity
		] : [
			e.sessionId,
			e.to,
			Infinity
		], l = IDBKeyRange.bound(s, t ?? c, !1, !!t), u = await this.db.transaction("messages"), d = await u.store.index(o ? "entityTime" : "time").openCursor(l, "prev"), f = {
			rows: [],
			scanned: 0,
			next: t
		}, p = performance.now() + 8, m = 0;
		for (; d && (a || f.rows.length < Math.min(100, i)) && f.scanned < 1e3 && !r();) {
			let t = d.value;
			if (f.scanned++, m += t.bytes, t.seq <= n && (!e.fe || String(t.fe) === e.fe) && (!e.direction || t.direction === e.direction) && is(t.json, e)) {
				if (a) {
					f.matched = !0;
					break;
				}
				let { json: e, ...n } = t;
				f.rows.push(n);
			}
			if (f.next = d.key, d = await d.continue(), m >= 1048576 || performance.now() >= p) break;
		}
		return d || (f.next = void 0), await u.done, f;
	}
	async readJSON(e, t) {
		let n = await this.db.get("messages", [e, t]);
		if (!n) throw Error("Сообщение не найдено");
		return n.json;
	}
	async exportChunk(e, t, n, r = 0) {
		if (!r && t >= n) return this.exportRecord = void 0, {
			text: "",
			next: void 0,
			offset: 0
		};
		let i = r && this.exportRecord?.sessionId === e && this.exportRecord.seq === t ? this.exportRecord : void 0;
		this.exportRecord = void 0;
		let a = await (i ? void 0 : await this.db.transaction("messages"))?.store.openCursor(IDBKeyRange.bound([e, t], [e, n], !r, !1));
		if (r && (i?.seq ?? a?.value.seq) !== t) throw Error("Экспортируемое сообщение удалено");
		let o = [], s = 0, c = t, l = 0, u = performance.now() + 8;
		for (; (a || i) && s < 65536 && l < 100;) {
			let e = i ?? a?.value;
			if (!e) break;
			let { json: t, ...d } = e, f = JSON.stringify(d).slice(0, -1) + ",\"message\":";
			if (r >= f.length + t.length + 2) throw Error("Неверная позиция экспорта");
			let p = Math.min(f.length + t.length + 2, r + 65536 - s), m = p <= f.length ? f.charCodeAt(p - 1) : t.charCodeAt(p - f.length - 1);
			m >= 55296 && m <= 56319 && p--;
			let h = f.slice(r, p) + t.slice(Math.max(0, r - f.length), Math.max(0, p - f.length)) + "}\n".slice(Math.max(0, r - f.length - t.length), Math.max(0, p - f.length - t.length));
			if (o.push(h), l++, s += h.length, c = e.seq, p < f.length + t.length + 2) return this.exportRecord = e, {
				text: o.join(""),
				next: c,
				offset: p
			};
			if (i) return {
				text: o.join(""),
				next: c < n ? c : void 0,
				offset: 0
			};
			if (r = 0, a = await a?.continue(), performance.now() >= u) break;
		}
		return {
			text: o.join(""),
			next: a ? c : void 0,
			offset: 0
		};
	}
	async remove(e) {
		if (this.exportRecord?.sessionId === e && (this.exportRecord = void 0), navigator.locks) return navigator.locks.request(`terminal-fe-session:${e}`, { ifAvailable: !0 }, async (t) => {
			if (!t) throw Error("Нельзя удалить сеанс, который записывается в другой вкладке");
			await this.deleteSession(e);
		});
		let t = await this.db.get("sessions", e);
		if (t && !t.endedAt) throw Error("Сначала остановите запись выбранного сеанса");
		return this.deleteSession(e);
	}
	async deleteSession(e) {
		let t = await this.db.transaction([
			"sessions",
			"messages",
			"meta"
		], "readwrite");
		t.done.catch(() => void 0);
		let n = await t.objectStore("sessions").get(e);
		await t.objectStore("messages").delete(IDBKeyRange.bound([e, 0], [e, Infinity])), await t.objectStore("sessions").delete(e), await t.objectStore("meta").delete(`transfer:${e}`);
		let r = await t.objectStore("meta").get("bytes") ?? 0;
		await t.objectStore("meta").put(Math.max(0, r - (n?.bytes ?? 0)), "bytes"), await t.done;
	}
	async removeAll() {
		this.exportRecord = void 0;
		let e = await this.holdLock(`terminal-fe-history:${this.db.name}`);
		try {
			let e = await this.db.transaction([
				"sessions",
				"messages",
				"meta"
			], "readwrite");
			if (e.done.catch(() => void 0), !navigator.locks) {
				let t = await e.objectStore("sessions").openCursor();
				for (; t;) {
					if (!t.value.endedAt) throw e.abort(), await e.done.catch(() => void 0), Error("Сначала остановите запись во всех вкладках");
					t = await t.continue();
				}
			}
			await Promise.all([
				e.objectStore("sessions").clear(),
				e.objectStore("messages").clear(),
				e.objectStore("meta").clear()
			]), await e.done;
		} finally {
			e();
		}
	}
	close() {
		this.exportRecord = void 0;
		for (let e of this.sessionLocks.values()) e();
		this.sessionLocks.clear(), this.db.close();
	}
}, ls = class {
	remaining;
	prefix;
	constructor(e) {
		this.remaining = e.kind === "body" ? e.remainingBytes : 0, this.prefix = e.kind === "header" ? [...e.prefix] : [];
	}
	skip(e) {
		let t = new Uint8Array(e), n = 0;
		if (this.prefix.length) {
			for (; this.prefix.length < 3 && n < t.length;) this.prefix.push(t[n++]);
			if (this.prefix.length < 3) return;
			let e = this.prefix[0] + this.prefix[1] * 256 + this.prefix[2] * 65536;
			if (e < 3) throw Error("Неверная длина начального FE-пакета");
			this.remaining = e - 3, this.prefix = [];
		}
		let r = Math.min(this.remaining, t.length - n);
		if (this.remaining -= r, n += r, !(this.remaining || n === t.length)) return n ? e.slice(n) : e;
	}
}, us = (e, t) => e + (/^[a-z_$][\w$]*$/i.test(t) ? `${e ? "." : ""}${t}` : `[${JSON.stringify(t)}]`), ds = class {
	json;
	ranges = /* @__PURE__ */ new Map();
	active = /* @__PURE__ */ new Map();
	arrays = /* @__PURE__ */ new Map();
	deadline = 0;
	constructor(e) {
		this.json = e;
	}
	async pause(e) {
		if (e() || performance.now() >= this.deadline && (await new Promise((e) => setTimeout(e, 0)), this.deadline = performance.now() + 8, e())) throw Error("Просмотр сообщения отменён");
	}
	space(e) {
		for (; /\s/.test(this.json[e] ?? "") && e < this.json.length;) e++;
		return e;
	}
	remember(e) {
		if (this.ranges.size >= 200) {
			let e = this.ranges.keys().next().value;
			e !== void 0 && this.ranges.delete(e);
		}
		return this.ranges.set(e.start, e), e;
	}
	pin(e) {
		if (this.active.delete(e.start), this.active.set(e.start, e), this.active.size > 16) {
			let e = this.active.keys().next().value;
			e !== void 0 && this.active.delete(e);
		}
	}
	async range(e, t) {
		let n = this.active.get(e);
		if (n) return n;
		let r = this.ranges.get(e);
		if (r) return r;
		if (!Number.isSafeInteger(e) || e < 0 || e >= this.json.length) throw Error("Неверная позиция JSON");
		if (e === 0) return this.remember({
			start: e,
			end: this.json.length
		});
		let i = this.json[e], a = i === "\"", o = +(i === "[" || i === "{"), s = e + 1, c = e + 65536;
		for (; s < this.json.length; s++) {
			s >= c && (await this.pause(t), c = s + 65536);
			let e = this.json[s];
			if (a) {
				if (e === "\\") s++;
				else if (e === "\"" && (a = !1, i === "\"")) {
					s++;
					break;
				}
			} else if (e === "\"") a = !0;
			else if (e === "[" || e === "{") o++;
			else if (e === "]" || e === "}") {
				if (!o || --o === 0) {
					o === 0 && (i === "[" || i === "{") && s++;
					break;
				}
			} else if (!o && (e === "," || /\s/.test(e))) break;
		}
		return this.remember({
			start: e,
			end: s
		});
	}
	node({ start: e, end: t }) {
		let n = this.json[e], r = "number";
		n === "{" ? r = "object" : n === "[" ? r = "array" : n === "\"" ? r = "string" : n === "n" ? r = "null" : (n === "t" || n === "f") && (r = "boolean");
		let i = this.arrays.get(e), a = r === "array" && i?.complete ? i.count : void 0, o = r === "object" ? "{…}" : "Array(…)";
		return a !== void 0 && (o = `Array(${a})`), r !== "object" && r !== "array" && (o = this.json.slice(e, Math.min(t, e + 120)), t - e > 120 && (o += "…")), {
			offset: e,
			length: t - e,
			type: r,
			preview: o,
			count: a
		};
	}
	async entry(e, t, n) {
		let r = this.space(t.offset), i = `[${t.index}]`;
		if (e === "object") {
			let e = await this.range(r, n);
			i = JSON.parse(this.json.slice(e.start, e.end)), r = this.space(e.end) + 1;
		}
		let a = await this.range(this.space(r), n), o = this.space(a.end);
		return this.json[o] === "," && (o = this.space(o + 1)), {
			key: i,
			range: a,
			next: {
				offset: o,
				index: t.index + 1
			}
		};
	}
	async matches(e, t, n, r, i = 0) {
		await this.pause(r);
		let a = this.json[e];
		if (a !== "{" && a !== "[") {
			let a = await this.range(e, r), o = JSON.parse(this.json.slice(e, a.end));
			return {
				end: a.end,
				found: n.test(o, t) || n.test(o, t, i)
			};
		}
		if (n.test(this, t) || n.test(this, t, i)) return {
			end: e,
			found: !0
		};
		let o = this.space(e + 1), s = 0;
		for (; this.json[o] !== (a === "{" ? "}" : "]");) {
			let e = String(s++);
			if (a === "{") {
				let t = await this.range(o, r);
				e = JSON.parse(this.json.slice(o, t.end)), o = this.space(this.space(t.end) + 1);
			}
			let c = await this.matches(o, [...t, e], n, r, i);
			if (c.found) return c;
			o = this.space(c.end), this.json[o] === "," && (o = this.space(o + 1));
		}
		return {
			end: o + 1,
			found: !1
		};
	}
	async find(e, t, n, r, i, a, o) {
		let s = {
			node: this.node(e),
			entries: [],
			columns: [],
			scanned: 0
		}, c = new rs(n), l = t?.trail?.map((e) => ({ ...e })) ?? [{
			...e,
			offset: t?.offset ?? this.space(e.start + 1),
			index: t?.index ?? 0
		}], u = performance.now() + 8, d = 0;
		for (; l.length && (o || s.entries.length < Math.min(100, a));) {
			await this.pause(r);
			let e = l[l.length - 1];
			if (e.offset >= e.end - 1 || l.length === 1 && e.index > i) {
				l.pop();
				continue;
			}
			let t = this.json[e.start] === "[", n = await this.entry(t ? "array" : "object", e, r), a = l.slice(1).map((e) => e.key ?? ""), f = t ? String(e.index) : n.key, p = a.reduce(us, ""), m = t ? `${p}[${e.index}]` : us(p, f);
			a.push(f);
			let h = this.json[n.range.start] === "{" || this.json[n.range.start] === "[", g = h && c.test(this, a), _ = t ? (await this.matches(n.range.start, a, c, r, a.length)).found : g || !h && (await this.matches(n.range.start, a, c, r)).found;
			if (s.scanned++, _ && o) return s.matched = !0, s.next = {
				offset: e.offset,
				index: e.index,
				trail: l
			}, s;
			let v = _ && !t && !h, y = v ? e : n.range;
			if (Object.assign(e, v ? { offset: e.end } : n.next), _ ? s.entries.push({
				...this.node(y),
				key: (v ? p || "$" : m).slice(0, 320),
				arrayOffset: t ? e.start : void 0,
				cells: []
			}) : !t && h && l.push({
				...n.range,
				offset: this.space(n.range.start + 1),
				index: 0,
				key: f
			}), d += h && !t && !_ ? 0 : y.end - y.start, s.scanned >= 1e3 || d >= 1048576 || performance.now() >= u) break;
		}
		for (; l.length;) {
			let e = l[l.length - 1];
			if (e.offset < e.end - 1 && (l.length > 1 || e.index <= i)) {
				s.next = {
					offset: e.offset,
					index: e.index,
					trail: l
				};
				break;
			}
			l.pop();
		}
		return s;
	}
	async page(e, t, n, r = () => !1, i = Infinity, a = !1, o = 100, s = !1) {
		this.deadline = performance.now() + 8;
		let c = await this.range(e, r);
		this.pin(c);
		let l = this.node(c), u = {
			node: l,
			entries: [],
			columns: [],
			scanned: 0
		}, d = !!(n.field || n.value);
		if (l.type !== "object" && l.type !== "array" || l.type === "array" && a && !d) return u;
		if (d) return this.find(c, t, n, r, i, o, s);
		let f = /* @__PURE__ */ new Map(), p = t ?? {
			offset: this.space(c.start + 1),
			index: 0
		}, m = 0, h = performance.now() + 8;
		for (; p.offset < c.end - 1 && p.index <= i && (s || u.entries.length < Math.min(100, o)) && u.scanned < 1e3;) {
			await this.pause(r);
			let e = await this.entry(l.type, p, r);
			if (u.scanned++, m += e.range.end - e.range.start, s) return u.matched = !0, u.next = p, u;
			let t = {
				...this.node(e.range),
				key: e.key.slice(0, 120),
				cells: []
			};
			if (l.type === "array" && t.type === "object") {
				let n = {
					offset: this.space(e.range.start + 1),
					index: 0
				};
				for (; n.offset < e.range.end - 1;) {
					await this.pause(r);
					let e = await this.entry("object", n, r), i = f.get(e.key);
					i === void 0 && f.size < 8 && (i = f.size, f.set(e.key, i), u.columns.push(e.key.slice(0, 120))), i !== void 0 && t.cells.push({
						column: i,
						node: this.node(e.range)
					}), n = e.next;
				}
			}
			if (u.entries.push(t), p = e.next, m >= 1048576 || performance.now() >= h) break;
		}
		return p.offset < c.end - 1 && p.index <= i && (u.next = p), u;
	}
	async segments(e, t = 0, n, r = () => !1) {
		this.deadline = performance.now() + 8;
		let i = await this.range(e, r);
		if (this.json[e] !== "[") throw Error("Этот узел не является массивом");
		this.pin(i);
		let a = this.arrays.get(e);
		if (a ||= {
			end: i.end,
			cursor: {
				offset: this.space(e + 1),
				index: 0
			},
			count: 0,
			starts: [],
			complete: !1
		}, this.arrays.delete(e), this.arrays.set(e, a), this.arrays.size > 8) {
			let e = this.arrays.keys().next().value;
			e !== void 0 && this.arrays.delete(e);
		}
		let o = performance.now() + 8, s = 0, c = 0;
		for (; !a.complete && a.cursor.offset < a.end - 1;) {
			await this.pause(r);
			let e = await this.entry("array", a.cursor, r);
			if (a.count % 100 == 0 && a.starts.push(a.cursor.offset), a.count++, c += e.range.end - a.cursor.offset, a.cursor = e.next, ++s >= 1e4 || c >= 1048576 || performance.now() >= o) break;
		}
		a.complete = a.cursor.offset >= a.end - 1;
		let l = {
			count: a.count,
			complete: a.complete,
			segments: []
		};
		if (!a.complete || !a.count) return l;
		let u = Math.min(n ?? a.count - 1, a.count - 1);
		if (!Number.isSafeInteger(t) || t < 0 || t % 100 || t > u || !Number.isSafeInteger(u)) throw Error("Неверный диапазон массива");
		let d = 100;
		for (; Math.ceil((u - t + 1) / d) > 100;) d *= 100;
		for (let e = t; e <= u; e += d) l.segments.push({
			from: e,
			to: Math.min(u, e + d - 1),
			cursor: {
				offset: a.starts[e / 100],
				index: e
			}
		});
		return l;
	}
	async text(e, t, n = () => !1) {
		let r = await this.range(e, n);
		return this.pin(r), {
			text: this.json.slice(r.start + t, Math.min(r.end, r.start + t + 65536)),
			length: r.end - r.start
		};
	}
};
//#endregion
//#region packages/core/src/lib/client/entitiesUtils/stringifyEntity.ts
function fs(e, t) {
	return typeof t == "bigint" ? t.toString() + "n" : t;
}
//#endregion
//#region packages/core/src/lib/services/debugTools/feTable/serialize.ts
function ps(e, t) {
	let n = JSON.stringify(e, (e, t) => e.toLowerCase() === "connectionkey" ? "[REDACTED]" : fs(e, t));
	return {
		...t,
		entity: e.type,
		json: n,
		bytes: new TextEncoder().encode(n).byteLength
	};
}
//#endregion
//#region packages/core/src/lib/services/debugTools/feTable/recorder.worker.ts
var ms = self, hs = ss().then(async (e) => {
	let t = new cs(e);
	return await t.recoverInterrupted(), t;
}), gs = /* @__PURE__ */ new Map(), _s = Promise.resolve(), vs = 0, ys = 0, bs, xs = Promise.resolve(), Ss = 0, Cs = /* @__PURE__ */ new Map(), ws = Promise.resolve(), Ts = [], Es = 0, Ds = 0, Os = "", ks, As = [], js = /* @__PURE__ */ new Set();
async function Ms(e, t, n, r) {
	if (r !== ys) throw Error("Просмотр сообщения отменён");
	let i = JSON.stringify([t, n]);
	if (bs?.key !== i) {
		bs = void 0;
		let r, a = xs.then(async () => {
			if (bs !== r) throw Error("Просмотр сообщения отменён");
			let i = await e.readJSON(t, n);
			if (bs !== r) throw Error("Просмотр сообщения отменён");
			return new ds(i);
		});
		r = {
			key: i,
			document: a
		}, bs = r, xs = a.then(() => void 0, () => void 0);
	}
	let a = bs;
	try {
		let e = await a.document;
		if (r !== ys || bs !== a) throw Error("Просмотр сообщения отменён");
		return e;
	} catch (e) {
		throw bs === a && r === ys && (bs = void 0), e;
	}
}
function Ns() {
	let e = 0;
	for (let t of Cs.values()) e += t.decoder.pendingByteLength;
	return e;
}
function Ps() {
	return {
		retainedBytes: Ns(),
		retentionRevision: ++Ss
	};
}
function Fs() {
	if (clearTimeout(ks), ks = void 0, !Ts.length) return;
	let e = Ts, t = Es, n = Os, r = As;
	Ts = [], Es = 0, As = [], ws = ws.then(async () => {
		try {
			if (js.has(n)) throw Error("Запись остановлена после ошибки IndexedDB");
			let t = await (await hs).append(n, e);
			for (let e of r) e.resolve(t);
		} catch (e) {
			gs.set(n, gs.get(n) ?? (e instanceof Error ? e.message : String(e))), js.add(n);
			for (let t of r) t.reject(e);
		} finally {
			Ds -= t;
		}
	});
}
function Is(e, t) {
	if (!t.length) return Promise.resolve();
	let n = t.reduce((e, t) => e + t.bytes, 0);
	if (Ds + n + Ns() > 67108864) throw Error(`Очередь записи IndexedDB переполнена (${os / 2 / 1048576} MiB)`);
	(Es + n > 1048576 || Ts.length && Os !== e) && Fs(), Os = e, Ts.push(...t), Es += n, Ds += n;
	let r = new Promise((e, t) => {
		As.push({
			resolve: e,
			reject: t
		});
	});
	return Es >= 1048576 ? Fs() : ks ||= setTimeout(Fs, 250), r;
}
async function Ls(e, t, n) {
	let r = await hs;
	if ((e.method === "append" || e.method === "raw") && gs.has(e.sessionId)) throw Error("Запись сеанса остановлена после ошибки");
	switch (e.method) {
		case "sessions": return r.sessions(e.before);
		case "start": return Fs(), await ws, js.clear(), Cs.clear(), gs.clear(), r.createSession(e.sessionId, e.origin);
		case "ingest": {
			if (e.json.length > 67108864 || !Number.isSafeInteger(e.batchId) || e.batchId < 1) throw Error("Неверная пачка передачи FE");
			let t = JSON.parse(e.json);
			if (!Array.isArray(t) || t.length > 1e5) throw Error("Неверные записи FE");
			let n = t.map((e) => {
				if (!e || typeof e.json != "string" || typeof e.entity != "string" || e.entity.length > 1e3 || typeof e.source != "string" || e.source.length > 1e3 || !["IN", "OUT"].includes(e.direction) || !Number.isSafeInteger(e.at) || !Number.isSafeInteger(e.fe) || !Number.isSafeInteger(e.connectionId)) throw Error("Неверные метаданные FE");
				return {
					at: e.at,
					fe: e.fe,
					source: e.source,
					connectionId: e.connectionId,
					direction: e.direction,
					entity: e.entity,
					json: e.json,
					bytes: new TextEncoder().encode(e.json).byteLength
				};
			});
			return r.append(e.sessionId, n, e.batchId);
		}
		case "stop": return Fs(), await ws, Cs.clear(), r.finish(e.sessionId, e.error ?? gs.get(e.sessionId));
		case "append": {
			let t = e.records.reduce((e, t) => e + t.bytes, 0);
			if (t + Ns() > 67108864) throw Error(`Пачка превышает свободный бюджет записи IndexedDB (${os / 2 / 1048576} MiB)`);
			if (Ds + t + Ns() > 67108864 && (Fs(), await ws, gs.has(e.sessionId))) throw Error("Запись сеанса остановлена после ошибки");
			return { committed: Is(e.sessionId, e.records) };
		}
		case "partial-start": return r.markPartialStart(e.sessionId);
		case "sync":
			Cs.set(e.source, {
				decoder: new No(),
				skipper: new ls(e.state)
			});
			return;
		case "raw": {
			let t = `${e.source}:${e.connectionId}:${e.direction}`;
			for (let t of Cs.keys()) t.startsWith(`${e.source}:`) && !t.startsWith(`${e.source}:${e.connectionId}:`) && Cs.delete(t);
			let n = Cs.get(t);
			n || (n = {
				decoder: new No(),
				skipper: new ls({ kind: "aligned" })
			}, Cs.set(t, n));
			let r = n.skipper.skip(e.buffer);
			if (!r) return Ps();
			let i = [], a = 0;
			for (let t of n.decoder.processBufferStream(r)) {
				let n = ps(t, {
					at: e.at,
					fe: e.fe,
					connectionId: e.connectionId,
					source: e.source,
					direction: e.direction
				});
				if (a += n.bytes, a + Ds + Ns() > 67108864) throw Error(`FE capture: декодированный пакет превышает бюджет записи (${os / 2 / 1048576} MiB); ${t.type}, ${a} B`);
				i.push(n);
			}
			if (n.decoder.pendingByteLength + Ds > 67108864) throw Error(`FE capture: незавершённый пакет превышает бюджет записи (${os / 2 / 1048576} MiB)`);
			n.decoder.pendingByteLength || (n.decoder = new No());
			let o = Ps();
			return i.length ? { committed: Is(e.sessionId, i).then((e) => ({
				session: e,
				...o
			})) } : o;
		}
		case "page": return t === vs ? r.page(e.filter, e.next, e.maxSeq, () => t !== vs, e.limit, e.probe) : {
			rows: [],
			scanned: 0
		};
		case "inspect": return (await Ms(r, e.sessionId, e.seq, n)).page(e.offset, e.after, e.filter, () => n !== ys, e.through, e.describeArrays, e.limit, e.probe);
		case "inspect-array": return (await Ms(r, e.sessionId, e.seq, n)).segments(e.offset, e.from, e.to, () => n !== ys);
		case "inspect-text": return (await Ms(r, e.sessionId, e.seq, n)).text(e.offset, e.from, () => n !== ys);
		case "inspect-clear": return;
		case "export": return r.exportChunk(e.sessionId, e.after, e.maxSeq, e.offset);
		case "remove": return r.remove(e.sessionId);
		case "remove-all": return r.removeAll();
		case "cancel": return;
		case "close":
			Fs(), await ws, r.close();
			return;
	}
}
ms.onmessage = ({ data: { id: e, command: t } }) => {
	[
		"inspect",
		"inspect-array",
		"inspect-text",
		"inspect-clear",
		"remove",
		"remove-all",
		"close"
	].includes(t.method) && ys++, [
		"inspect-clear",
		"remove",
		"remove-all",
		"close"
	].includes(t.method) && (bs = void 0), (t.method === "inspect" || t.method === "inspect-text" || t.method === "inspect-array") && bs?.key !== JSON.stringify([t.sessionId, t.seq]) && (bs = void 0), [
		"page",
		"cancel",
		"remove-all"
	].includes(t.method) && vs++;
	let n = vs, r = ys, i = (n) => {
		(t.method === "append" || t.method === "raw") && (gs.set(t.sessionId, gs.get(t.sessionId) ?? (n instanceof Error ? n.message : String(n))), Cs.clear()), ms.postMessage({
			id: e,
			error: n instanceof Error ? n.message : String(n)
		});
	}, a = async () => {
		try {
			let a = await Ls(t, n, r);
			a && typeof a == "object" && "committed" in a ? (t.method === "append" && ms.postMessage({
				id: e,
				accepted: !0
			}), a.committed.then((t) => ms.postMessage({
				id: e,
				value: t
			})).catch(i)) : ms.postMessage({
				id: e,
				value: a
			});
		} catch (e) {
			i(e);
		}
	};
	[
		"sessions",
		"page",
		"export",
		"cancel",
		"inspect",
		"inspect-array",
		"inspect-text",
		"inspect-clear"
	].includes(t.method) ? a() : _s = _s.then(a);
};
//#endregion
