export class Base {
	name= null,
	text_align= null,
	human_readable= 0,
	radius= null,
	line_thickness= null,
	enabled= true,
	type= null,
	pos_x= 0.0,
	pos_y= 0.0,
	width= 0.0,
	height= 0.0,
	rotation= 0.0,
	code_type= null,
	font_size= null,
	font_id= null,
	image_id= null,
	data= null,
	template_id= null,
	id= null,
	font_rel= null,
	image_rel= null
	
	constructor(type) {
		this.type = type
	}
	get style() {
		return {}
	}
}
