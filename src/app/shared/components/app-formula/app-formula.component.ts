import { Component, OnInit, ViewChild } from '@angular/core';

// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import MathType from '@wiris/mathtype-ckeditor5';

@Component({
  selector: 'app-formula',
  templateUrl: './app-formula.component.html',
  styleUrls: ['./app-formula.component.css']
})
export class AppFormulaComponent implements OnInit {
  // public Editor = ClassicEditor;
  constructor() {
    // ClassicEditor.builtinPlugins = [
    //   'Essentials'
    //   // ...
    //   // MathType
    // ];
    // const plugins = ClassicEditor.builtinPlugins;
    // console.log(plugins);
  }

  ngOnInit() {
  }

}
