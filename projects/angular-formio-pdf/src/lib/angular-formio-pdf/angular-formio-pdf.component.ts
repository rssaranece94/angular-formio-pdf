import { Component, OnInit, Input } from '@angular/core';
declare var pdfMake: any;
// import * as moment from 'moment';
import * as momentImported from 'moment';
const moment = momentImported;


@Component({
  selector: 'angular-formio-pdf',
  templateUrl: './angular-formio-pdf.component.html',
  styleUrls: ['./angular-formio-pdf.component.css']
})
export class AngularFormioPdfComponent implements OnInit {

  @Input() component;
  @Input() submission;
  @Input() pdf;
  private simplifiedDate;
  private pdfconfig = {
    footer: function (currentPage: any, pageCount: any) {
      return [
        { text: currentPage.toString() + ' of ' + pageCount, alignment: 'right', margin: [0, 40, 20, 15] },
      ];
    },
    pageSize: 'A4',
    pageOrientation: 'portrait',
    pageMargins: [40, 40, 40, 80],
    content: [],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 15],
        alignment: 'center'
      },
      label: {
        bold: true,
        fontSize: 14,
        lineHeight: 1.3
      },
      value: {
        height: 30,
        color: '#222'
      },
      table: {
        margin: [0, 5, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
        alignment: 'center',
        margin: [0, 5, 0, 5]
      },
      para: {
        lineHeight: 1.5,
        alignment: 'center',
        margin: [0, 10, 0, 15]
      },
      columns: {
        margin: [0, 15, 0, 15]
      },
      signature: {
        width: 520
      }
    },
    defaultStyle: {
      columnGap: 20
    }
  }
  constructor() { }

  ngOnInit() {
    this.pdf = { ...this.pdfconfig, ...this.pdf }
    this.simplifiedDate = this.component.map(v => {
      return this.getSimplifiedLayout(v);
    });
    this.simplifiedDate.map(v => {
      this.getSimplifiedPdfLayout(v);
    });
    this.generatepdf();
  }

  generatepdf() {
    const pdfDocGenerator = pdfMake.createPdf(this.pdfconfig);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      const targetElement = document.getElementById('angularFormIOPdf');
      const iframe = this.createiframe();
      iframe.src = dataUrl;
      targetElement.appendChild(iframe);
    });
  }
  createiframe() {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('id', 'ifAssessmentView');
    iframe.setAttribute('name', 'ifAssessmentView');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('webkitallowfullscreen', '');
    iframe.setAttribute('mozallowfullscreen', '');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('style', 'width: -webkit-fill-available; height: -webkit-fill-available;');
    return iframe;
  }
  getSimplifiedLayout(data) {
    if (data.type === 'columns') {
      return this.getLayoutColumns(data);
    } else if (data.type === 'fieldset' || data.type === 'panel' || data.type === 'well') {
      if (data.type === 'panel') {
        return {
          type: data.type,
          value: (this.submission[data.key]) ? this.submission[data.key] : '',
          key: data.key,
          hidelabel: false,
          label: data.title,
          input: data.input,
          component: this.getComponent(data.components)
        }
      } else {
        return {
          type: data.type,
          value: (this.submission[data.key]) ? this.submission[data.key] : '',
          key: data.key,
          hidelabel: data.hideLabel,
          label: data.label,
          input: data.input,
          component: this.getComponent(data.components)
        }
      }
    } else if (data.type === 'table') {
      return {
        type: data.type,
        value: (this.submission[data.key]) ? this.submission[data.key] : '',
        key: data.key,
        hidelabel: data.hideLabel,
        label: data.label,
        input: data.input,
        component: data.rows.map(k => {
          return k.map(c => {
            return this.getComponent(c.components)
          })
        })
      }
    } else if (data.input) {
      let out = {
        type: data.type,
        value: (this.submission[data.key]) ? this.submission[data.key] : '',
        key: data.key,
        hidelabel: data.hideLabel,
        label: data.label,
        input: data.input,
        component: (data.components && data.components.length) ? this.getComponent(data.components) : undefined
      }
      if (data.type === 'datetime') {
        out.value = (this.submission[data.key]) ? moment(this.submission[data.key]).format('DD-MM-YYYY') : '';
      } else if (data.key === 'submit') {
        out.value = '';
        out.hidelabel = true;
      }
      return out;
    }
  }
  getLayoutColumns(v) {
    const obj = {
      type: v.type,
      value: (this.submission[v.key]) ? this.submission[v.key] : '',
      key: v.key,
      label: v.label,
      component: v.columns.map(x => {
        if (x.type === 'column') {
          return {
            type: x.type,
            value: (this.submission[x.key]) ? this.submission[x.key] : '',
            key: x.key,
            hidelabel: x.hideLabel,
            label: x.label,
            input: false,
            component: (x.components && x.components.length) ? this.getComponent(x.components) : undefined
          }
        } else {
          return v.type;
        }
      })
    }
    obj.component = [].concat.apply([], obj.component);
    return obj;
  }
  getComponent(data) {
    return data.map(k => {
      if (k.input && k.type !== 'button' && k.key !== 'submit') {
        if (k.type === 'signature' && this.submission[k.key] !== '') {
          return {
            type: k.type,
            value: (this.submission[k.key]) ? this.submission[k.key] : '',
            key: k.key,
            image: true,
            hidelabel: true,
            label: k.label,
            input: k.input,
            component: (k.components && k.components.length) ? this.getComponent(k.components) : undefined
          }
        } else {
          let out = {
            type: k.type,
            value: (this.submission[k.key]) ? this.submission[k.key] : '',
            key: k.key,
            image: false,
            hidelabel: k.hideLabel,
            label: k.label,
            input: k.input,
            component: (k.components && k.components.length) ? this.getComponent(k.components) : undefined
          }
          if (k.type === 'checkbox' || k.type === 'radio') {
            out.hidelabel = true;
          }
          if (k.type === 'datetime') {
            out.value = (this.submission[k.key]) ? moment(this.submission[k.key]).format('DD-MM-YYYY') : '';
          }
          return out;
        }
      } else if (k.type === 'htmlelement') {
        if (k.content.includes('<img src=')) {
          return {
            type: k.type,
            value: k.content.replace('<img src=\"', '').replace('\" alt=\"\">', '').replace('<br>', ''),
            key: k.key,
            hidelabel: true,
            image: true,
            label: k.label,
            input: k.input,
            component: (k.components && k.components.length) ? this.getComponent(k.components) : undefined
          }
        } else {
          return {
            type: k.type,
            value: k.content.replace('<center>', '').replace('</center>', '').replace('<br>', ''),
            key: k.key,
            image: false,
            hidelabel: true,
            label: k.label,
            input: k.input,
            component: (k.components && k.components.length) ? this.getComponent(k.components) : undefined
          }
        }
      } else {
        return (!k.input) ? this.getSimplifiedLayout(k) : k.type;
      }
    })
  }


  getSimplifiedPdfLayout(data) {
    if (data.type === 'columns') {

      if (data.component && data.component.length) {
        this.pdfconfig.content.push(this.getPdfLayoutColumns(data.component));
      }
    } else if (data.type === 'fieldset' || data.type === 'panel' || data.type === 'well') {
      if (data.type === 'panel') {
        if (!data.hidelabel) {
          this.pdfconfig.content.push({
            text: data.label,
            style: 'header'
          })
        }
        if (data.component && data.component.length) {
          let component = this.getPdfComponent(data.component, 'panel');
          component = [].concat.apply([], component);
          this.pdfconfig.content.push(component);
        }
      } else {
        this.getPdfInput(data);
      }
    } else if (data.type === 'table') {
      const tabel = {
        style: 'table',
        table: {
          widths: data.component[0].map(x => '*'),
          body: data.component.map((k, ind) => {
            let rows = k.map(c => {
              let columns;
              if (ind === 0) {
                columns = (c.length) ? this.getPdfComponent(c, 'table', true) : '';
              } else {
                columns = (c.length) ? this.getPdfComponent(c, 'table') : '';
              }
              columns = (typeof columns !== 'string') ? [].concat.apply([], columns) : '';
              return columns;
            })
            return rows;
          })
        }
      };
      this.pdfconfig.content.push(tabel);
    } else if (data.input) {
      this.pdfconfig.content.push(this.getPdfInput(data));
    } else { }
  }
  getPdfLayoutColumns(v) {
    let col = v.map(x => {
      let component = (x.component) ? this.getPdfComponent(x.component, 'column') : '';
      component = (typeof component !== 'string') ? [].concat.apply([], component) : '';
      return component;
    })
    let updatedcol = col.map(v => {
      return {
        text: (v === '') ? [] : v
      }
    });
    updatedcol = [].concat.apply([], updatedcol);
    return {
      columns: updatedcol,
      style: 'columns'
    };
  }
  getPdfComponent(data, type?, tablehead?) {
    return data.map(k => {
      if (k.input) {
        let arr = []
        if (!k.hidelabel) {
          arr.push({
            text: `${k.label} \n`,
            style: 'label'
          });
        }
        if (k.image && k.value !== '') {
          arr.push({
            image: k.value,
            style: 'signature'
          });
        } else {
          arr.push({
            text: `${k.value}`,
            style: 'value'
          });
        }
        if (k.component && k.component.length) {
          arr.push(this.getPdfComponent(k.component, 'inner'));
        }
        if (type === 'inner' || type === 'table' || type === 'column') {
          return arr;
        } else {
          this.pdfconfig.content.push(arr);
        }
      } else if (k.type === 'htmlelement') {
        let arr = []
        if (k.image && k.value !== '') {
          arr.push({
            image: k.value
          });
        } else {
          if (tablehead) {
            arr.push({
              text: k.value,
              style: 'tableHeader'
            });
          } else {
            arr.push({
              text: k.value,
              style: 'para'
            });
          }
        }
        if (k.component && k.component.length) {
          arr.push(this.getPdfComponent(k.component, 'inner'));
        }
        if (type === 'table') {
          return arr;
        } else {
          this.pdfconfig.content = [...this.pdfconfig.content, ...arr];
        }
      } else {
        if (!k.input) {
          this.getSimplifiedPdfLayout(k);
        } else {

        }
      }
    })
  }
  getPdfInput(v) {
    if (!v.hidelabel) {
      this.pdfconfig.content.push({
        text: `${v.label} \n`,
        style: 'label'
      });
    }
    this.pdfconfig.content.push({
      text: `${v.value}`,
      style: 'value'
    });
    if (v.component && v.component.length) {
      let arr = [];
      arr.push(this.getPdfComponent(v.component));
      arr = [].concat.apply([], arr);
      this.pdfconfig.content.push(arr)
    }
  }
}
