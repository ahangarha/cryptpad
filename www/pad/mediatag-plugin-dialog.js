CKEDITOR.dialog.add('mediatag', function (editor) {
    var Messages = editor.plugins.mediatag.translations;
    return {
        title: Messages.title,
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: Messages.title,
                elements: [
                    {
                        type: 'text',
                        id: 'width',
                        label: Messages.width,
                        validate: function () {
                            if (isNaN(this.getValue())) { return false; }
                        }
                    },
                    {
                        type: 'text',
                        id: 'height',
                        label: Messages.height,
                        validate: function () {
                            if (isNaN(this.getValue())) { return false; }
                        }
                    },
                    {
                        type: 'checkbox',
                        id: 'lock',
                        'default': 'checked',
                        label: Messages.ratio,
                    },
                    {
                        type: 'text',
                        id: 'border',
                        label: Messages.border,
                        validate: function () {
                            if (isNaN(this.getValue())) { return false; }
                        }
                    },
                    {
                        type: 'html',
                        id: 'preview',
                        html: '<label>'+Messages.preview+'</label>'+
                              '<div id="ck-mediatag-preview"'+
                'style="margin:auto;resize:both;max-width:300px;max-height:300px;overflow:auto"'+
                              '></div>'
                    },
                ]
            },
        ],
        onShow: function () {
            var sel = editor.getSelection();
            element = sel.getSelectedElement();
            if (!element) { return; }

            var el = element.findOne('media-tag');
            if (!el) { return; }

            var rect = el.getClientRect();
            var dialog = this.parts.contents.$;
            var inputs = dialog.querySelectorAll('input');
            var wInput = inputs[0];
            var hInput = inputs[1];
            wInput.value = Math.round(rect.width);
            hInput.value = Math.round(rect.height);

            var keepRatio = inputs[2];
            var ratio = wInput.value/hInput.value;

            var borderInput = inputs[3];
            var bValue = el.getStyle('border-width').replace('px', '') || 0;
            borderInput.value = bValue;

            var $preview = $(dialog).find('#ck-mediatag-preview');
            var $clone = $(el.$).clone();
            $clone.css({
                display: 'flex',
                'border-style': 'solid',
                'border-color': 'black'
            });
            $preview.html('').append($clone);

            var update = function () {
                var w = $(wInput).val() || Math.round(rect.width);
                var h = $(hInput).val() || Math.round(rect.height);
                var b = $(borderInput).val() || bValue;
                $clone.css({
                    width: w+'px',
                    height: h+'px',
                    'border-width': b+'px'
                });
            };

            $(wInput).on('keyup', function () {
                if (!$(keepRatio).is(':checked')) { return; }
                var w = $(wInput).val();
                if (isNaN(w)) { return; }
                var newVal = w/ratio;
                $(hInput).val(Math.round(newVal));
                update();
            });
            $(hInput).on('keyup', function () {
                if (!$(keepRatio).is(':checked')) { return; }
                var h = $(hInput).val();
                if (isNaN(h)) { return; }
                var newVal = h*ratio;
                $(wInput).val(Math.round(newVal));
                update();
            });
            $(keepRatio).on('change', function () {
                ratio = $(wInput).val()/$(hInput).val();
            });

            $(borderInput).on('keyup', function () {
                update();
            });
        },
        onOk: function() {
            var dialog = this;

            var sel = editor.getSelection();
            element = sel.getSelectedElement();
            if (!element) { return; }

            var el = element.findOne('media-tag');
            if (!el) { return; }

            var dialog = this.parts.contents.$;
            var inputs = dialog.querySelectorAll('input');
            var wInput = inputs[0];
            var hInput = inputs[1];
            var bInput = inputs[3];

            window.setTimeout(function () {
                if (wInput.value === "") {
                    el.removeAttribute('width');
                    el.removeStyle('width');
                } else {
                    el.setSize('width', parseInt(wInput.value));
                }
                if (hInput.value === "") {
                    el.removeAttribute('height');
                    el.removeStyle('height');
                } else {
                    el.setSize('height', parseInt(hInput.value));
                }
                if (bInput.value === "") {
                    el.removeStyle('border-width');
                } else {
                    el.setStyle('border-width', parseInt(bInput.value)+'px');
                }
                editor.fire( 'change' );
            });
        }
    };
});
