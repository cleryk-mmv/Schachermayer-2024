# myElement = document.querySelector("header")
# headroom  = new Headroom(myElement,
#   offset: 150
#   classes: 
#     notTop: "header--not-top"
# )
# headroom.init()

document.addEventListener 'DOMContentLoaded', () ->

  vModalEl    = document.getElementById('onModal')
  vModal = bootstrap.Modal.getOrCreateInstance(vModalEl)
  vModal.show()