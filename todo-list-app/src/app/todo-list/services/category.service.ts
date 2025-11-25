import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../interfaces/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>(
    this.getCategoriesFromLocalStorage()
  );
  categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.saveCategoriesToLocalStorage(this.getCategoriesFromLocalStorage());
  }

  private getCategoriesFromLocalStorage(): Category[] {
    const categories = localStorage.getItem('categories');
    return categories ? JSON.parse(categories) : [];
  }

  private saveCategoriesToLocalStorage(categories: Category[]): void {
    localStorage.setItem('categories', JSON.stringify(categories));
    this.categoriesSubject.next(categories);
  }

  getCategories(): Category[] {
    return this.categoriesSubject.getValue();
  }

  saveCategories(categories: Category[]): void {
    this.saveCategoriesToLocalStorage(categories);
  }

  addCategory(category: Category): void {
    const categories = this.getCategories();
    categories.push(category);
    this.saveCategories(categories);
  }

  removeCategory(categoryId: number): void {
    const categories = this.getCategories().filter((c) => c.id !== categoryId);
    this.saveCategories(categories);
  }

  editCategory(categoryId: number, newName: string, newColor: string): void {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === categoryId);
    if (index !== -1) {
      categories[index].name = newName;
      categories[index].color = newColor;
      this.saveCategories(categories);
    }
  }
}