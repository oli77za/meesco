import { Template } from "meteor/templating";
import "./main_layout.html";
import "./main_layout.scss";


Template.main_layout.helpers({
    getHeader: function () {
        return {
            template: this.headerTemplate,
            data: this.headerData
        }
    },
    getContent: function () {
        return {
            template: this.contentTemplate,
            data: this.contentData
        }
    }
});
