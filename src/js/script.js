import '../css/style.css';

require.context('./../assets/img', true, /\.(png|svg|jpg|gif)$/);
require.context('./../assets/audio', true, /\.wav$/);

const div = document.createElement('div');
div.innerHTML = 'start';
document.body.append(div);
