import {src, dest} from 'gulp'
import jade from 'gulp-jade'
import inject from 'gulp-inject'

export default function html() {
	return src('src/*.jade')
		.pipe(jade({
			'pretty': true
		}))
		.pipe(inject(src('dest/icons/icons.svg'), {
			'transform': function(fileName, file) {
				return file.contents.toString('utf8');
			}
		}))
		.pipe(dest('dest'))
}
