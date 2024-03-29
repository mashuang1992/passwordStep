!function(t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t(jQuery)
}(function(t) {
    t.extend(t.fn, {
        validate: function(e) {
            if (!this.length)
                return void (e && e.debug && window.console && console.warn("Nothing selected, can't validate, returning nothing."));
            var i = t.data(this[0], "validator");
            return i ? i : (this.attr("novalidate", "novalidate"),
            i = new t.validator(e,this[0]),
            t.data(this[0], "validator", i),
            i.settings.onsubmit && (this.validateDelegate(":submit", "click", function(e) {
                i.settings.submitHandler && (i.submitButton = e.target),
                t(e.target).hasClass("cancel") && (i.cancelSubmit = !0),
                void 0 !== t(e.target).attr("formnovalidate") && (i.cancelSubmit = !0)
            }),
            this.submit(function(e) {
                function r() {
                    var r, s;
                    return i.settings.submitHandler ? (i.submitButton && (r = t("<input type='hidden'/>").attr("name", i.submitButton.name).val(t(i.submitButton).val()).appendTo(i.currentForm)),
                    s = i.settings.submitHandler.call(i, i.currentForm, e),
                    i.submitButton && r.remove(),
                    void 0 !== s ? s : !1) : !0
                }
                return i.settings.debug && e.preventDefault(),
                i.cancelSubmit ? (i.cancelSubmit = !1,
                r()) : i.form() ? i.pendingRequest ? (i.formSubmitted = !0,
                !1) : r() : (i.focusInvalid(),
                !1)
            })),
            i)
        },
        valid: function() {
            var e, i;
            return t(this[0]).is("form") ? e = this.validate().form() : (e = !0,
            i = t(this[0].form).validate(),
            this.each(function() {
                e = i.element(this) && e
            })),
            e
        },
        removeAttrs: function(e) {
            var i = {}
              , r = this;
            return t.each(e.split(/\s/), function(t, e) {
                i[e] = r.attr(e),
                r.removeAttr(e)
            }),
            i
        },
        rules: function(e, i) {
            var r, s, n, a, o, u, d = this[0];
            if (e)
                switch (r = t.data(d.form, "validator").settings,
                s = r.rules,
                n = t.validator.staticRules(d),
                e) {
                case "add":
                    t.extend(n, t.validator.normalizeRule(i)),
                    delete n.messages,
                    s[d.name] = n,
                    i.messages && (r.messages[d.name] = t.extend(r.messages[d.name], i.messages));
                    break;
                case "remove":
                    return i ? (u = {},
                    t.each(i.split(/\s/), function(e, i) {
                        u[i] = n[i],
                        delete n[i],
                        "required" === i && t(d).removeAttr("aria-required")
                    }),
                    u) : (delete s[d.name],
                    n)
                }
            return a = t.validator.normalizeRules(t.extend({}, t.validator.classRules(d), t.validator.attributeRules(d), t.validator.dataRules(d), t.validator.staticRules(d)), d),
            a.required && (o = a.required,
            delete a.required,
            a = t.extend({
                required: o
            }, a),
            t(d).attr("aria-required", "true")),
            a.remote && (o = a.remote,
            delete a.remote,
            a = t.extend(a, {
                remote: o
            })),
            a
        }
    }),
    t.extend(t.expr[":"], {
        blank: function(e) {
            return !t.trim("" + t(e).val())
        },
        filled: function(e) {
            return !!t.trim("" + t(e).val())
        },
        unchecked: function(e) {
            return !t(e).prop("checked")
        }
    }),
    t.validator = function(e, i) {
        this.settings = t.extend(!0, {}, t.validator.defaults, e),
        this.currentForm = i,
        this.init()
    }
    ,
    t.validator.format = function(e, i) {
        return 1 === arguments.length ? function() {
            var i = t.makeArray(arguments);
            return i.unshift(e),
            t.validator.format.apply(this, i)
        }
        : (arguments.length > 2 && i.constructor !== Array && (i = t.makeArray(arguments).slice(1)),
        i.constructor !== Array && (i = [i]),
        t.each(i, function(t, i) {
            e = e.replace(new RegExp("\\{" + t + "\\}","g"), function() {
                return i
            })
        }),
        e)
    }
    ,
    t.extend(t.validator, {
        defaults: {
            messages: {},
            groups: {},
            rules: {},
            errorClass: "help-block",
            validClass: "valid",
            errorElement: "span",
            focusCleanup: !1,
            focusInvalid: !1,
            errorContainer: t([]),
            errorLabelContainer: t([]),
            onsubmit: !0,
            ignore: ":hidden",
            ignoreTitle: !1,
            onfocusin: function(t) {
                this.lastActive = t,
                this.settings.focusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, t, this.settings.errorClass, this.settings.validClass),
                this.hideThese(this.errorsFor(t)))
            },
            onfocusout: function(t) {
                this.checkable(t) || !(t.name in this.submitted) && this.optional(t) || this.element(t)
            },
            onkeyup: function(t, e) {
                (9 !== e.which || "" !== this.elementValue(t)) && (t.name in this.submitted || t === this.lastElement) && this.element(t)
            },
            onclick: function(t) {
                t.name in this.submitted ? this.element(t) : t.parentNode.name in this.submitted && this.element(t.parentNode)
            },
            unhighlight: function(e, i, r) {
                "radio" === e.type ? this.findByName(e.name).removeClass(i).addClass(r) : t(e).removeClass(i).addClass(r)
            },
            highlight: function(e) {
                t(e).closest(".form-group").addClass("has-error")
            },
            success: function(t) {
                t.closest(".form-group").removeClass("has-error"),
                t.remove()
            },
            errorPlacement: function(t, e) {
                e.parent("div").append(t)
            }
        },
        setDefaults: function(e) {
            t.extend(t.validator.defaults, e)
        },
        messages: {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date ( ISO ).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            maxlength: t.validator.format("Please enter no more than {0} characters."),
            minlength: t.validator.format("Please enter at least {0} characters."),
            rangelength: t.validator.format("Please enter a value between {0} and {1} characters long."),
            range: t.validator.format("Please enter a value between {0} and {1}."),
            max: t.validator.format("Please enter a value less than or equal to {0}."),
            min: t.validator.format("Please enter a value greater than or equal to {0}.")
        },
        autoCreateRanges: !1,
        prototype: {
            init: function() {
                function e(e) {
                    var i = t.data(this[0].form, "validator")
                      , r = "on" + e.type.replace(/^validate/, "")
                      , s = i.settings;
                    s[r] && !this.is(s.ignore) && s[r].call(i, this[0], e)
                }
                this.labelContainer = t(this.settings.errorLabelContainer),
                this.errorContext = this.labelContainer.length && this.labelContainer || t(this.currentForm),
                this.containers = t(this.settings.errorContainer).add(this.settings.errorLabelContainer),
                this.submitted = {},
                this.valueCache = {},
                this.pendingRequest = 0,
                this.pending = {},
                this.invalid = {},
                this.reset();
                var i, r = this.groups = {};
                t.each(this.settings.groups, function(e, i) {
                    "string" == typeof i && (i = i.split(/\s/)),
                    t.each(i, function(t, i) {
                        r[i] = e
                    })
                }),
                i = this.settings.rules,
                t.each(i, function(e, r) {
                    i[e] = t.validator.normalizeRule(r)
                }),
                t(this.currentForm).validateDelegate(":text, [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'], [type='radio'], [type='checkbox']", "focusin focusout keyup", e).validateDelegate("select, option, [type='radio'], [type='checkbox']", "click", e),
                this.settings.invalidHandler && t(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler),
                t(this.currentForm).find("[required], [data-rule-required], .required").attr("aria-required", "true")
            },
            form: function() {
                return this.checkForm(),
                t.extend(this.submitted, this.errorMap),
                this.invalid = t.extend({}, this.errorMap),
                this.valid() || t(this.currentForm).triggerHandler("invalid-form", [this]),
                this.showErrors(),
                this.valid()
            },
            checkForm: function() {
                this.prepareForm();
                for (var t = 0, e = this.currentElements = this.elements(); e[t]; t++)
                    this.check(e[t]);
                return this.valid()
            },
            element: function(e) {
                var i = this.clean(e)
                  , r = this.validationTargetFor(i)
                  , s = !0;
                return this.lastElement = r,
                void 0 === r ? delete this.invalid[i.name] : (this.prepareElement(r),
                this.currentElements = t(r),
                s = this.check(r) !== !1,
                s ? delete this.invalid[r.name] : this.invalid[r.name] = !0),
                t(e).attr("aria-invalid", !s),
                this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)),
                this.showErrors(),
                s
            },
            showErrors: function(e) {
                if (e) {
                    t.extend(this.errorMap, e),
                    this.errorList = [];
                    for (var i in e)
                        this.errorList.push({
                            message: e[i],
                            element: this.findByName(i)[0]
                        });
                    this.successList = t.grep(this.successList, function(t) {
                        return !(t.name in e)
                    })
                }
                this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
            },
            resetForm: function() {
                t.fn.resetForm && t(this.currentForm).resetForm(),
                this.submitted = {},
                this.lastElement = null,
                this.prepareForm(),
                this.hideErrors(),
                this.elements().removeClass(this.settings.errorClass).removeData("previousValue").removeAttr("aria-invalid")
            },
            numberOfInvalids: function() {
                return this.objectLength(this.invalid)
            },
            objectLength: function(t) {
                var e, i = 0;
                for (e in t)
                    i++;
                return i
            },
            hideErrors: function() {
                this.hideThese(this.toHide)
            },
            hideThese: function(t) {
                t.not(this.containers).text(""),
                this.addWrapper(t).hide()
            },
            valid: function() {
                return 0 === this.size()
            },
            size: function() {
                return this.errorList.length
            },
            focusInvalid: function() {
                if (this.settings.focusInvalid)
                    try {
                        t(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
                    } catch (e) {}
            },
            findLastActive: function() {
                var e = this.lastActive;
                return e && 1 === t.grep(this.errorList, function(t) {
                    return t.element.name === e.name
                }).length && e
            },
            elements: function() {
                var e = this
                  , i = {};
                return t(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled], [readonly]").not(this.settings.ignore).filter(function() {
                    return !this.name && e.settings.debug && window.console && console.error("%o has no name assigned", this),
                    this.name in i || !e.objectLength(t(this).rules()) ? !1 : (i[this.name] = !0,
                    !0)
                })
            },
            clean: function(e) {
                return t(e)[0]
            },
            errors: function() {
                var e = this.settings.errorClass.split(" ").join(".");
                return t(this.settings.errorElement + "." + e, this.errorContext)
            },
            reset: function() {
                this.successList = [],
                this.errorList = [],
                this.errorMap = {},
                this.toShow = t([]),
                this.toHide = t([]),
                this.currentElements = t([])
            },
            prepareForm: function() {
                this.reset(),
                this.toHide = this.errors().add(this.containers)
            },
            prepareElement: function(t) {
                this.reset(),
                this.toHide = this.errorsFor(t)
            },
            elementValue: function(e) {
                var i, r = t(e), s = e.type;
                return "radio" === s || "checkbox" === s ? t("input[name='" + e.name + "']:checked").val() : "number" === s && "undefined" != typeof e.validity ? e.validity.badInput ? !1 : r.val() : (i = r.val(),
                "string" == typeof i ? i.replace(/\r/g, "") : i)
            },
            check: function(e) {
                e = this.validationTargetFor(this.clean(e));
                var i, r, s, n = t(e).rules(), a = t.map(n, function(t, e) {
                    return e
                }).length, o = !1, u = this.elementValue(e);
                for (r in n) {
                    s = {
                        method: r,
                        parameters: n[r]
                    };
                    try {
                        if (i = t.validator.methods[r].call(this, u, e, s.parameters),
                        "dependency-mismatch" === i && 1 === a) {
                            o = !0;
                            continue
                        }
                        if (o = !1,
                        "pending" === i)
                            return void (this.toHide = this.toHide.not(this.errorsFor(e)));
                        if (!i)
                            return this.formatAndAdd(e, s),
                            !1
                    } catch (d) {
                        throw this.settings.debug && window.console && console.log("Exception occurred when checking element " + e.id + ", check the '" + s.method + "' method.", d),
                        d
                    }
                }
                if (!o)
                    return this.objectLength(n) && this.successList.push(e),
                    !0
            },
            customDataMessage: function(e, i) {
                return t(e).data("msg" + i.charAt(0).toUpperCase() + i.substring(1).toLowerCase()) || t(e).data("msg")
            },
            customMessage: function(t, e) {
                var i = this.settings.messages[t];
                return i && (i.constructor === String ? i : i[e])
            },
            findDefined: function() {
                for (var t = 0; t < arguments.length; t++)
                    if (void 0 !== arguments[t])
                        return arguments[t]
            },
            defaultMessage: function(e, i) {
                return this.findDefined(this.customMessage(e.name, i), this.customDataMessage(e, i), !this.settings.ignoreTitle && e.title || void 0, t.validator.messages[i], "<strong>Warning: No message defined for " + e.name + "</strong>")
            },
            formatAndAdd: function(e, i) {
                var r = this.defaultMessage(e, i.method)
                  , s = /\$?\{(\d+)\}/g;
                "function" == typeof r ? r = r.call(this, i.parameters, e) : s.test(r) && (r = t.validator.format(r.replace(s, "{$1}"), i.parameters)),
                this.errorList.push({
                    message: r,
                    element: e,
                    method: i.method
                }),
                this.errorMap[e.name] = r,
                this.submitted[e.name] = r
            },
            addWrapper: function(t) {
                return this.settings.wrapper && (t = t.add(t.parent(this.settings.wrapper))),
                t
            },
            defaultShowErrors: function() {
                var t, e, i;
                for (t = 0; this.errorList[t]; t++)
                    i = this.errorList[t],
                    this.settings.highlight && this.settings.highlight.call(this, i.element, this.settings.errorClass, this.settings.validClass),
                    this.showLabel(i.element, i.message);
                if (this.errorList.length && (this.toShow = this.toShow.add(this.containers)),
                this.settings.success)
                    for (t = 0; this.successList[t]; t++)
                        this.showLabel(this.successList[t]);
                if (this.settings.unhighlight)
                    for (t = 0,
                    e = this.validElements(); e[t]; t++)
                        this.settings.unhighlight.call(this, e[t], this.settings.errorClass, this.settings.validClass);
                this.toHide = this.toHide.not(this.toShow),
                this.hideErrors(),
                this.addWrapper(this.toShow).show()
            },
            validElements: function() {
                return this.currentElements.not(this.invalidElements())
            },
            invalidElements: function() {
                return t(this.errorList).map(function() {
                    return this.element
                })
            },
            showLabel: function(e, i) {
                var r, s, n, a = this.errorsFor(e), o = this.idOrName(e), u = t(e).attr("aria-describedby");
                a.length ? (a.removeClass(this.settings.validClass).addClass(this.settings.errorClass),
                a.html(i)) : (a = t("<" + this.settings.errorElement + ">").attr("id", o + "-error").addClass(this.settings.errorClass).html(i || ""),
                r = a,
                this.settings.wrapper && (r = a.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()),
                this.labelContainer.length ? this.labelContainer.append(r) : this.settings.errorPlacement ? this.settings.errorPlacement(r, t(e)) : r.insertAfter(e),
                a.is("label") ? a.attr("for", o) : 0 === a.parents("label[for='" + o + "']").length && (n = a.attr("id").replace(/(:|\.|\[|\])/g, "\\$1"),
                u ? u.match(new RegExp("\\b" + n + "\\b")) || (u += " " + n) : u = n,
                t(e).attr("aria-describedby", u),
                s = this.groups[e.name],
                s && t.each(this.groups, function(e, i) {
                    i === s && t("[name='" + e + "']", this.currentForm).attr("aria-describedby", a.attr("id"))
                }))),
                !i && this.settings.success && (a.text(""),
                "string" == typeof this.settings.success ? a.addClass(this.settings.success) : this.settings.success(a, e)),
                this.toShow = this.toShow.add(a)
            },
            errorsFor: function(e) {
                var i = this.idOrName(e)
                  , r = t(e).attr("aria-describedby")
                  , s = "label[for='" + i + "'], label[for='" + i + "'] *";
                return r && (s = s + ", #" + r.replace(/\s+/g, ", #")),
                this.errors().filter(s)
            },
            idOrName: function(t) {
                return this.groups[t.name] || (this.checkable(t) ? t.name : t.id || t.name)
            },
            validationTargetFor: function(e) {
                return this.checkable(e) && (e = this.findByName(e.name)),
                t(e).not(this.settings.ignore)[0]
            },
            checkable: function(t) {
                return /radio|checkbox/i.test(t.type)
            },
            findByName: function(e) {
                return t(this.currentForm).find("[name='" + e + "']")
            },
            getLength: function(e, i) {
                switch (i.nodeName.toLowerCase()) {
                case "select":
                    return t("option:selected", i).length;
                case "input":
                    if (this.checkable(i))
                        return this.findByName(i.name).filter(":checked").length
                }
                return e.length
            },
            depend: function(t, e) {
                return this.dependTypes[typeof t] ? this.dependTypes[typeof t](t, e) : !0
            },
            dependTypes: {
                "boolean": function(t) {
                    return t
                },
                string: function(e, i) {
                    return !!t(e, i.form).length
                },
                "function": function(t, e) {
                    return t(e)
                }
            },
            optional: function(e) {
                var i = this.elementValue(e);
                return !t.validator.methods.required.call(this, i, e) && "dependency-mismatch"
            },
            startRequest: function(t) {
                this.pending[t.name] || (this.pendingRequest++,
                this.pending[t.name] = !0)
            },
            stopRequest: function(e, i) {
                this.pendingRequest--,
                this.pendingRequest < 0 && (this.pendingRequest = 0),
                delete this.pending[e.name],
                i && 0 === this.pendingRequest && this.formSubmitted && this.form() ? (t(this.currentForm).submit(),
                this.formSubmitted = !1) : !i && 0 === this.pendingRequest && this.formSubmitted && (t(this.currentForm).triggerHandler("invalid-form", [this]),
                this.formSubmitted = !1)
            },
            previousValue: function(e) {
                return t.data(e, "previousValue") || t.data(e, "previousValue", {
                    old: null,
                    valid: !0,
                    message: this.defaultMessage(e, "remote")
                })
            }
        },
        classRuleSettings: {
            required: {
                required: !0
            },
            email: {
                email: !0
            },
            url: {
                url: !0
            },
            date: {
                date: !0
            },
            dateISO: {
                dateISO: !0
            },
            number: {
                number: !0
            },
            digits: {
                digits: !0
            },
            creditcard: {
                creditcard: !0
            }
        },
        addClassRules: function(e, i) {
            e.constructor === String ? this.classRuleSettings[e] = i : t.extend(this.classRuleSettings, e)
        },
        classRules: function(e) {
            var i = {}
              , r = t(e).attr("class");
            return r && t.each(r.split(" "), function() {
                this in t.validator.classRuleSettings && t.extend(i, t.validator.classRuleSettings[this])
            }),
            i
        },
        attributeRules: function(e) {
            var i, r, s = {}, n = t(e), a = e.getAttribute("type");
            for (i in t.validator.methods)
                "required" === i ? (r = e.getAttribute(i),
                "" === r && (r = !0),
                r = !!r) : r = n.attr(i),
                /min|max/.test(i) && (null === a || /number|range|text/.test(a)) && (r = Number(r)),
                r || 0 === r ? s[i] = r : a === i && "range" !== a && (s[i] = !0);
            return s.maxlength && /-1|2147483647|524288/.test(s.maxlength) && delete s.maxlength,
            s
        },
        dataRules: function(e) {
            var i, r, s = {}, n = t(e);
            for (i in t.validator.methods)
                r = n.data("rule" + i.charAt(0).toUpperCase() + i.substring(1).toLowerCase()),
                void 0 !== r && (s[i] = r);
            return s
        },
        staticRules: function(e) {
            var i = {}
              , r = t.data(e.form, "validator");
            return r.settings.rules && (i = t.validator.normalizeRule(r.settings.rules[e.name]) || {}),
            i
        },
        normalizeRules: function(e, i) {
            return t.each(e, function(r, s) {
                if (s === !1)
                    return void delete e[r];
                if (s.param || s.depends) {
                    var n = !0;
                    switch (typeof s.depends) {
                    case "string":
                        n = !!t(s.depends, i.form).length;
                        break;
                    case "function":
                        n = s.depends.call(i, i)
                    }
                    n ? e[r] = void 0 !== s.param ? s.param : !0 : delete e[r]
                }
            }),
            t.each(e, function(r, s) {
                e[r] = t.isFunction(s) ? s(i) : s
            }),
            t.each(["minlength", "maxlength"], function() {
                e[this] && (e[this] = Number(e[this]))
            }),
            t.each(["rangelength", "range"], function() {
                var i;
                e[this] && (t.isArray(e[this]) ? e[this] = [Number(e[this][0]), Number(e[this][1])] : "string" == typeof e[this] && (i = e[this].replace(/[\[\]]/g, "").split(/[\s,]+/),
                e[this] = [Number(i[0]), Number(i[1])]))
            }),
            t.validator.autoCreateRanges && (null != e.min && null != e.max && (e.range = [e.min, e.max],
            delete e.min,
            delete e.max),
            null != e.minlength && null != e.maxlength && (e.rangelength = [e.minlength, e.maxlength],
            delete e.minlength,
            delete e.maxlength)),
            e
        },
        normalizeRule: function(e) {
            if ("string" == typeof e) {
                var i = {};
                t.each(e.split(/\s/), function() {
                    i[this] = !0
                }),
                e = i
            }
            return e
        },
        addMethod: function(e, i, r) {
            t.validator.methods[e] = i,
            t.validator.messages[e] = void 0 !== r ? r : t.validator.messages[e],
            i.length < 3 && t.validator.addClassRules(e, t.validator.normalizeRule(e))
        },
        methods: {
            required: function(e, i, r) {
                if (!this.depend(r, i))
                    return "dependency-mismatch";
                if ("select" === i.nodeName.toLowerCase()) {
                    var s = t(i).val();
                    return s && s.length > 0
                }
                return this.checkable(i) ? this.getLength(e, i) > 0 : t.trim(e).length > 0
            },
            email: function(t, e) {
                return this.optional(e) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(t)
            },
            url: function(t, e) {
                return this.optional(e) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(t)
            },
            date: function(t, e) {
                return this.optional(e) || !/Invalid|NaN/.test(new Date(t).toString())
            },
            dateISO: function(t, e) {
                return this.optional(e) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(t)
            },
            number: function(t, e) {
                return this.optional(e) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(t)
            },
            digits: function(t, e) {
                return this.optional(e) || /^\d+$/.test(t)
            },
            creditcard: function(t, e) {
                if (this.optional(e))
                    return "dependency-mismatch";
                if (/[^0-9 \-]+/.test(t))
                    return !1;
                var i, r, s = 0, n = 0, a = !1;
                if (t = t.replace(/\D/g, ""),
                t.length < 13 || t.length > 19)
                    return !1;
                for (i = t.length - 1; i >= 0; i--)
                    r = t.charAt(i),
                    n = parseInt(r, 10),
                    a && (n *= 2) > 9 && (n -= 9),
                    s += n,
                    a = !a;
                return s % 10 === 0
            },
            minlength: function(e, i, r) {
                var s = t.isArray(e) ? e.length : this.getLength(e, i);
                return this.optional(i) || s >= r
            },
            maxlength: function(e, i, r) {
                var s = t.isArray(e) ? e.length : this.getLength(e, i);
                return this.optional(i) || r >= s
            },
            rangelength: function(e, i, r) {
                var s = t.isArray(e) ? e.length : this.getLength(e, i);
                return this.optional(i) || s >= r[0] && s <= r[1]
            },
            min: function(t, e, i) {
                return this.optional(e) || t >= i
            },
            max: function(t, e, i) {
                return this.optional(e) || i >= t
            },
            range: function(t, e, i) {
                return this.optional(e) || t >= i[0] && t <= i[1]
            },
            equalTo: function(e, i, r) {
                var s = t(r);
                return this.settings.onfocusout && s.unbind(".validate-equalTo").bind("blur.validate-equalTo", function() {
                    t(i).valid()
                }),
                e === s.val()
            },
            remote: function(e, i, r) {
                if (this.optional(i))
                    return "dependency-mismatch";
                var s, n, a = this.previousValue(i);
                return this.settings.messages[i.name] || (this.settings.messages[i.name] = {}),
                a.originalMessage = this.settings.messages[i.name].remote,
                this.settings.messages[i.name].remote = a.message,
                r = "string" == typeof r && {
                    url: r
                } || r,
                a.old === e ? a.valid : (a.old = e,
                s = this,
                this.startRequest(i),
                n = {},
                n[i.name] = e,
                t.ajax(t.extend(!0, {
                    url: r,
                    mode: "abort",
                    port: "validate" + i.name,
                    dataType: "json",
                    data: n,
                    context: s.currentForm,
                    success: function(r) {
                        var n, o, u, d = r === !0 || "true" === r || !r.exists;
                        s.settings.messages[i.name].remote = a.originalMessage,
                        d ? (u = s.formSubmitted,
                        s.prepareElement(i),
                        s.formSubmitted = u,
                        s.successList.push(i),
                        delete s.invalid[i.name],
                        s.showErrors()) : (n = {},
                        o = s.defaultMessage(i, "remote") || r,
                        n[i.name] = a.message = t.isFunction(o) ? o(e) : o,
                        s.invalid[i.name] = !0,
                        s.showErrors(n)),
                        a.valid = d,
                        s.stopRequest(i, d)
                    }
                }, r)),
                "pending")
            }
        }
    }),
    t.format = function() {
        throw "$.format has been deprecated. Please use $.validator.format instead."
    }
    ;
    var e, i = {};
    t.ajaxPrefilter ? t.ajaxPrefilter(function(t, e, r) {
        var s = t.port;
        "abort" === t.mode && (i[s] && i[s].abort(),
        i[s] = r)
    }) : (e = t.ajax,
    t.ajax = function(r) {
        var s = ("mode"in r ? r : t.ajaxSettings).mode
          , n = ("port"in r ? r : t.ajaxSettings).port;
        return "abort" === s ? (i[n] && i[n].abort(),
        i[n] = e.apply(this, arguments),
        i[n]) : e.apply(this, arguments)
    }
    ),
    t.extend(t.fn, {
        validateDelegate: function(e, i, r) {
            return this.bind(i, function(i) {
                var s = t(i.target);
                return s.is(e) ? r.apply(s, arguments) : void 0
            })
        }
    }),
    t.validator.addMethod("stringCheck", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || /^(\s)*[a-zA-Z0-9_\u4e00-\u9fa5]+(\s)*$/.test(e)
    }, "\u53ea\u80fd\u5305\u62ec\u4e2d\u6587\u5b57\u3001\u82f1\u6587\u5b57\u6bcd\u3001\u6570\u5b57\u548c\u4e0b\u5212\u7ebf"),
    t.validator.addMethod("cnNickname", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || /^(\s)*[a-zA-Z0-9_\u4e00-\u9fa5]+(\s)*$/.test(e)
    }, "\u53ea\u80fd\u7531\u5b57\u6bcd\u3001\u6570\u5b57\u3001\u4e0b\u5212\u7ebf\u548c\u6c49\u5b57\u7ec4\u6210\uff0c\u533a\u5206\u5927\u5c0f\u5199"),
    t.validator.addMethod("cnName", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || /^(\s)*([\u4e00-\u9fa5]+[\uff0e.\xb7\u2022]{0,1}[\u4e00-\u9fa5]+)+(\s)*$/.test(e)
    }, "\u53ea\u80fd\u5305\u62ec\u4e2d\u6587\u5b57\u3001\u82f1\u6587\u5b57\u6bcd\u6216\u8005\u70b9\u53f7"),
    t.validator.addMethod("psCheck", function(t, e) {
        return this.optional(e) || /^(\s)*[a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)]+(\s)*$/.test(t)
    }, "\u53ea\u80fd\u5305\u62ec\u5b57\u6bcd\u3001\u6570\u5b57\u548c\u7279\u6b8a\u5b57\u7b26"),
    t.validator.addMethod("isIdCardNo", function(t, e) {
        return this.optional(e) || /(^\d{15}$)|(\d{17}(?:\d|x|X)$)/.test(t)
    }, "\u8bf7\u6b63\u786e\u8f93\u5165\u60a8\u7684\u8eab\u4efd\u8bc1\u53f7\u7801"),
    t.validator.addMethod("cnPhone", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || /^(\d{3,4}-)\d{7,8}(-\d{1,6})?$/.test(e)
    }, "\u8bf7\u6b63\u786e\u8f93\u5165\u60a8\u7684\u7535\u8bdd\u53f7\u7801"),
    t.validator.addMethod("cnMobile", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || /^[1][2-8][0-9]{9}$/.test(e) || /^[9][0-9]{10}$/.test(e)
    }, "\u8bf7\u6b63\u786e\u8f93\u5165\u60a8\u7684\u624b\u673a\u53f7\u7801"),
    t.validator.addMethod("isCardNo", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || /^\d{16,19}$/g.test(e)
    }, "\u8bf7\u6b63\u786e\u8f93\u5165\u60a8\u7684\u94f6\u884c\u5361\u53f7"),
    t.validator.addMethod("isNotPhone", function(t, e) {
        return this.optional(e) || !/^\d{11}$/.test(t)
    }, "\u4e0d\u80fd\u4e3a\u624b\u673a\u53f7\u7801"),
    t.validator.addMethod("mobileOrMail", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || /^[1][2-8][0-9]{9}$/.test(e) || /^[9][0-9]{10}$/.test(e) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/.test(e)
    }, "\u4e0d\u80fd\u4e3a\u624b\u673a\u53f7\u7801"),
    t.validator.addMethod("cardNoMailMobile", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || /^[1][2-8][0-9]{9}$/.test(e) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(e) || /^\d{16,19}$/g.test(e)
    }, "\u8d26\u53f7\u4e3a\u60a8\u7684\u94f6\u884c\u5361\u53f7\uff0c\u6216\u624b\u673a\u53f7\u7801,\u6216\u90ae\u7bb1\u5730\u5740"),
    t.validator.addMethod("numPassword", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || !/(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){5}\d/.test(e) && !/(?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){5}\d/.test(e)
    }, "\u4e0d\u80fd\u987a\u589e\u6216\u987a\u51cf"),
    t.validator.addMethod("echoNum", function(e, i) {
        return e = t.trim(e),
        this.optional(i) || !/^(?:([0-9])\1{5})$/.test(e)
    }, "\u4e0d\u80fd\u5168\u662f\u76f8\u540c\u5b57\u7b26")
});
