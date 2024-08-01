CKEDITOR.editorConfig = function (config) {
    config.language = "fa";
    config.uiColor = "#525fe1";

    config.toolbarGroups = [{ name: "document", groups: ["mode", "document", "doctools"] }, { name: "clipboard", groups: ["clipboard", "undo"] }, { name: "editing", groups: ["find", "selection", "spellchecker", "editing"] }, { name: "forms", groups: ["forms"] }, "/", { name: "basicstyles", groups: ["basicstyles", "cleanup"] }, { name: "paragraph", groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"] }, { name: "links", groups: ["links"] }, { name: "insert", groups: ["insert"] }, "/", { name: "styles", groups: ["styles"] }, { name: "colors", groups: ["colors"] }, { name: "tools", groups: ["tools"] }, { name: "others", groups: ["others"] }, { name: "about", groups: ["about"] }];

    config.removeButtons = "Image,Table,Anchor,NewPage,Print,Preview,ExportPdf,Source,Templates,ImageButton,Button,HiddenField,Select,SpecialChar,PageBreak,Iframe,HorizontalRule,ShowBlocks,About,Radio,Checkbox,Form,TextField,Textarea,SelectAll";
};
