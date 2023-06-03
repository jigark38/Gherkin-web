import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject, Input, OnChanges, SimpleChanges, AfterContentInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-camera-capture-dialog',
  templateUrl: './camera-capture-dialog.component.html',
  styleUrls: ['./camera-capture-dialog.component.css']
})
export class CameraCaptureDialogComponent implements OnInit, OnChanges, AfterContentInit {



  showCaptureAgain: boolean;
  hasError: boolean;
  constructor(private renderer: Renderer2,
              public dialogRef: MatDialogRef<CameraCaptureDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // tslint:disable-next-line: member-ordering
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  // tslint:disable-next-line: member-ordering
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  // tslint:disable-next-line: member-ordering
  videoWidth = 0;
  // tslint:disable-next-line: member-ordering
  videoHeight = 0;
  // tslint:disable-next-line: member-ordering
  constraints = {
    video: {
      facingMode: 'environment',
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };




  ngOnInit() {
    this.startCamera();
  }

  ngAfterContentInit(): void {
    // this.startCamera();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
  startVidoeAgain() {
    this.startCamera();
  }
  startCamera() {
    this.showCaptureAgain = false;
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      alert('Sorry, camera not available. Try to open you website with "https".');
      this.hasError = true;
      this.dialogRef.close();
    }
  }

  attachVideo(stream) {
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }

  capture() {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    this.renderer.listen(this.videoElement.nativeElement, 'pause', (event) => {
    });
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', null);
    this.showCaptureAgain = true;
  }

  handleError(error) {
    console.log('Error: ', error);
  }

  done() {
    this.canvas.nativeElement.toBlob((blob: any) => {
      this.data = blob;
    });

    setTimeout(() => {
      this.dialogRef.close(this.data);
    }, 1000);

  }

}
