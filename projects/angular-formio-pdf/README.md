# AngularFormioPdf

It will supports angular 4+.

## Download

Run `npm install angular-formio-pdf pdfmake moment --save`.

> Note: Angular Formio Pdf uses `Moment` for date conversions and `Pdfmake` to generate pdf view.

### Usage

Import it in respective module.

```
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFormioPdfModule } from 'angular-formio-pdf';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AngularFormioPdfModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

In `app.compoment.html`

```
<angular-formio-pdf *ngIf="submission" [component]="component" [submission]="submission" [pdf]="pdfconfig" (onRenderBlob)="onblob($event)" (onRenderBase64)="onbase64($event)" (onRenderBuffer)="onbuffer($event)">
</angular-formio-pdf>
```

In `app.compoment.ts` form-builder component input sample below and submission(form submited values) data input and pdf configuration (your own customization of [pdfmake](http://pdfmake.org/). Most imporant you should leave the content in pdf configuration empty `content: []`).

Outputs are enabled as Buffer, Blob and Base64. Try sample code below.

```
import { Component } from '@angular/core';
import moment from 'moment';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  component = undefined;
  submission = undefined;
  pdfconfig = undefined;
  ngOnInit() {
    this.component = [
      {
        "label": "Panel",
        "title": "Page Title",
        "collapsible": false,
        "mask": false,
        "tableView": false,
        "alwaysEnabled": false,
        "type": "panel",
        "input": false,
        "key": "panel",
        "components": [
          {
            "label": "Name",
            "allowMultipleMasks": false,
            "showWordCount": false,
            "showCharCount": false,
            "tableView": true,
            "alwaysEnabled": false,
            "type": "textfield",
            "input": true,
            "key": "name",
            "properties": {},
            "tags": []
          },
          {
            "label": "Columns",
            "columns": [
              {
                "components": [
                  {
                    "label": "Date Of Birth",
                    "allowMultipleMasks": false,
                    "showWordCount": false,
                    "showCharCount": false,
                    "tableView": true,
                    "alwaysEnabled": false,
                    "type": "textfield",
                    "input": true,
                    "key": "dob",
                    "properties": {},
                    "tags": []
                  }
                ],
                "width": 6,
                "offset": 0,
                "push": 0,
                "pull": 0,
                "type": "column",
                "hideOnChildrenHidden": false,
                "input": true,
                "key": "",
                "tableView": true,
                "label": ""
              },
              {
                "components": [
                  {
                    "label": "Qualification",
                    "allowMultipleMasks": false,
                    "showWordCount": false,
                    "showCharCount": false,
                    "tableView": true,
                    "alwaysEnabled": false,
                    "type": "textfield",
                    "input": true,
                    "key": "qualification",
                    "properties": {},
                    "tags": []
                  }
                ],
                "width": 6,
                "offset": 0,
                "push": 0,
                "pull": 0,
                "type": "column",
                "hideOnChildrenHidden": false,
                "input": true,
                "key": "",
                "tableView": true,
                "label": ""
              }
            ],
            "mask": false,
            "tableView": false,
            "alwaysEnabled": false,
            "type": "columns",
            "input": false,
            "key": "columns"
          }
        ]
      },
      {
        "type": "submit",
        "label": "Submit",
        "key": "submit",
        "disableOnInvalid": true,
        "theme": "primary",
        "input": true,
        "tableView": true
      }
    ];
    this.submission = {
      "name": "Mr Louis",
      "dob": "2019-02-11T18:30:00.000Z",
      "qualification": "UG",
    };
    this.pdfconfig = {
        content: [],                        // should always be empty array
        ...                                 // you own customization for pdfmake
    };
  }
}
```

Html styling suppotred for component type `htmlelement`. Styles which are supported for PDFMake text are supported. Some style example below.

```
{
  label: 'HTML',
  content: 'This is sub title',
  style: {
    bold: true | false,
    margin: [0, 0, 0, 0], // positions [left, top, right, bottom]
    lineHeight: 1.3,
    fontSize: 14,
    color: '#000', // name or Hex codes
    alignment: 'center | left | right'
  },
  type: 'htmlelement',
  input: false,
  key: 'html',
  .........
  .....
}
```

## Demo

[Angular FormIO PDF](https://stackblitz.com/edit/angular-formio-pdf)

## License

MIT
