import '../css/style.css';
import ListModel from './models/listModel'
import ListController from './controller/ListController';
import ListView from './views/ListViewer'

require.context('./../assets/img', true, /\.(png|svg|jpg|gif)$/);
require.context('./../assets/audio', true, /\.wav$/);

const div = document.createElement('div');
div.innerHTML = `Your favourite JavaScript technologies:<br>
<select id="list" size="10" style="width: 17em"></select><br>
<button id="plusBtn">  +  </button>
<button id="minusBtn">  -  </button>`;
document.body.append(div);

window.addEventListener('load', () => {
  const model = new ListModel(['node.js', 'react']),
    view = new ListView(model, {
      'list' : document.getElementById('list'),
      'addButton' : document.getElementById('plusBtn'), 
      'delButton' : document.getElementById('minusBtn')
    }),
    controller = new ListController(model, view);

  view.show();
});