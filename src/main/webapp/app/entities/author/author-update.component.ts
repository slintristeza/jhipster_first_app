import { Component, OnInit } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IAuthor, Author } from 'app/shared/model/author.model';
import { AuthorService } from './author.service';

@Component({
  selector: 'jhi-author-update',
  templateUrl: './author-update.component.html'
})
export class AuthorUpdateComponent implements OnInit {
  isSaving: boolean;

  editForm = this.fb.group({
    id: [],
    name: [],
    phoneticName: []
  });

  constructor(protected authorService: AuthorService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit() {
    this.isSaving = false;
    this.activatedRoute.data.subscribe(({ author }) => {
      this.updateForm(author);
    });
  }

  updateForm(author: IAuthor) {
    this.editForm.patchValue({
      id: author.id,
      name: author.name,
      phoneticName: author.phoneticName
    });
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const author = this.createFromForm();
    if (author.id !== undefined) {
      this.subscribeToSaveResponse(this.authorService.update(author));
    } else {
      this.subscribeToSaveResponse(this.authorService.create(author));
    }
  }

  private createFromForm(): IAuthor {
    return {
      ...new Author(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      phoneticName: this.editForm.get(['phoneticName']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAuthor>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
}
