import {App, DirectiveBinding, ObjectDirective} from "vue";

const createListener = (el : any, binding : DirectiveBinding) => {
    el.addEventListener("contextmenu",(e: MouseEvent)=>{
        e.stopPropagation();
        binding.value(e);
    })
}

const rightClickDirective : ObjectDirective = {
    beforeMount(el, binding) {
        createListener(el, binding);
    }
}

export default {
    install (app : App<Element>) {
        app.directive('right-click', rightClickDirective)
    }
}
