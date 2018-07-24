# Be sure to restart your server when you modify this file.

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf
#
# Tonnes of MS office MIME types.
Mime::Type.register "application/msword", :doc
Mime::Type.register "application/msword", :dot
Mime::Type.register "application/vnd.openxmlformats-officedocument.wordprocessingml.document", :docx
Mime::Type.register "application/vnd.openxmlformats-officedocument.wordprocessingml.template", :dotx
Mime::Type.register "application/vnd.ms-word.document.macroEnabled.12", :docm
Mime::Type.register "application/vnd.ms-word.template.macroEnabled.12", :dotm
Mime::Type.register "application/vnd.ms-excel", :xls
Mime::Type.register "application/vnd.ms-excel", :xlt
Mime::Type.register "application/vnd.ms-excel", :xla
Mime::Type.register "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", :xlsx
Mime::Type.register "application/vnd.openxmlformats-officedocument.spreadsheetml.template", :xltx
Mime::Type.register "application/vnd.ms-excel.sheet.macroEnabled.12", :xlsm
Mime::Type.register "application/vnd.ms-excel.template.macroEnabled.12", :xltm
Mime::Type.register "application/vnd.ms-excel.addin.macroEnabled.12", :xlam
Mime::Type.register "application/vnd.ms-excel.sheet.binary.macroEnabled.12", :xlsb
Mime::Type.register "application/vnd.ms-powerpoint", :ppt
Mime::Type.register "application/vnd.ms-powerpoint", :pot
Mime::Type.register "application/vnd.ms-powerpoint", :pps
Mime::Type.register "application/vnd.ms-powerpoint", :ppa
Mime::Type.register "application/vnd.openxmlformats-officedocument.presentationml.presentation", :pptx
Mime::Type.register "application/vnd.openxmlformats-officedocument.presentationml.template", :potx
Mime::Type.register "application/vnd.openxmlformats-officedocument.presentationml.slideshow", :ppsx
Mime::Type.register "application/vnd.ms-powerpoint.addin.macroEnabled.12", :ppam
Mime::Type.register "application/vnd.ms-powerpoint.presentation.macroEnabled.12", :pptm
Mime::Type.register "application/vnd.ms-powerpoint.template.macroEnabled.12", :potm
Mime::Type.register "application/vnd.ms-powerpoint.slideshow.macroEnabled.12", :ppsm
Mime::Type.register "application/vnd.ms-access", :mdb
