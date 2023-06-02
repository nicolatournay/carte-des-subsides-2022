// import * as tingle from './tingle.min.js';

export {openModal};

function openModal(template) {
   // instanciate new modal
    var modal = new tingle.modal({
        footer: false,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        onOpen: function() {
            console.log('modal open');
        },
        onClose: function() {
            console.log('modal closed');
        }
    });

    // set content
    modal.setContent(template);

    // open modal
    modal.open();

}