$(function() {
    'use strict';

    var values = {
            'vmax':  {'node': null, 'value': null, 'handler': calculateFromVMean},
            'vmean': {'node': null, 'value': null, 'handler': calculateFromVMean},
            'vrms':  {'node': null, 'value': null, 'handler': calculateFromVRMS},
            'res':   {'node': null, 'value': null, 'handler': calculateFromRes},
            'wmean': {'node': null, 'value': null, 'handler': calculateFromWMean},
            'wrms':  {'node': null, 'value': null, 'handler': calculateFromWRMS}
        };

    function processValue(name) {
        var v;
        v = parseFloat(values[name].node.val());
        // TODO Add error handler here
        values[name].value = v;
    }

    function getValue(name) {
        var result = null;

        if(values.hasOwnProperty(name)) {
            if(values[name].value === null) {
                processValue(name);
            }
            result = values[name].value;
        }

        return result;
    }

    function setValue(name, value) {
        var v = value.toFixed(2);
        values[name].node.val(v);
        values[name].value = v;
    }

    function calculateFromVMean() {
        var vmax = getValue('vmax'),
            vmean = getValue('vmean'),
            vrms = Math.sqrt(vmax * vmean),
            res = getValue('res'),
            wmean = (vmean * vmean) / res,
            wrms = (vmax * vmean) / res;

        setValue('vrms', vrms);
        setValue('wmean', wmean);
        setValue('wrms', wrms);
    }

    function calculateFromVRMS() {
        var vmax = getValue('vmax'),
            vrms = getValue('vrms'),
            vmean = (vrms * vrms) / vmax,
            res = getValue('res'),
            wmean = (vmean * vmean) / res,
            wrms = (vmax * vmean) / res;

        setValue('vmean', vmean);
        setValue('wmean', wmean);
        setValue('wrms', wrms);
    }

    function calculateFromRes() {
        var vmax = getValue('vmax'),
            vmean = getValue('vmean'),
            res = getValue('res'),
            wmean = (vmean * vmean) / res,
            wrms = (vmax * vmean) / res;

        setValue('wmean', wmean);
        setValue('wrms', wrms);
    }

    function calculateFromWMean() {
        var vmax = getValue('vmax'),
            wmean = getValue('wmean'),
            res = getValue('res'),
            vmean = Math.sqrt(wmean * res),
            vrms = Math.sqrt(vmax * vmean),
            wrms = (vmax * vmean) / res;

        setValue('vmean', vmean);
        setValue('vrms', vrms);
        setValue('wrms', wrms);
    }

    function calculateFromWRMS() {
        var vmax = getValue('vmax'),
            wrms = getValue('wrms'),
            res = getValue('res'),

            vmean = (wrms * res) / vmax,
            vrms = Math.sqrt(vmax * vmean),
            wmean = (vmean * vmean) / res;

        setValue('vmean', vmean);
        setValue('vrms', vrms);
        setValue('wmean', wmean);
    }

    function updateValues() {
        for(var name in values) {
            if(values.hasOwnProperty(name) && values[name].node !== null) {
                processValue(name);
            }
        }
    }

    function onChange() {
        var $this = $(this),
            name = $this.attr('name');

        if(values[name] !== undefined) {
            updateValues();
            values[name].handler.call($this);
        }
    }

    function findNodes() {
        $('input').each(function() {
            var $this = $(this),
                name = $this.attr('name');

            if(values[name] !== undefined) {
                values[name].node = $this;
                $this.on('change keyup', onChange);
            }
        });
    }

    findNodes();
});