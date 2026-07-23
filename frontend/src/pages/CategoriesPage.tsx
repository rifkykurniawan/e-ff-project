import { useState } from "react";
import { Plus, Edit2, Trash2, Tags, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { Modal } from "../components/Modal";
import { CategoryForm } from "../features/categories/CategoryForm";
import type { Category, CategoryInput } from "../types/categories";

export function CategoriesPage() {
  const { categories, isLoading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();

  const handleOpenModal = (category?: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(undefined);
  };

  const handleSubmit = async (data: CategoryInput) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, input: data });
      } else {
        await createCategory(data);
      }
      handleCloseModal();
    } catch (error: any) {
      console.error("Failed to save category", error);
      if (error.code === '23505') {
        alert("A category with this name already exists for this type.");
      } else {
        alert("An error occurred while saving the category.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error("Failed to delete category", error);
        alert("Failed to delete category. It might be used in transactions.");
      }
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center text-zinc-500">Loading categories...</div>;
  }

  const incomeCategories = categories.filter(c => c.type === "Income");
  const expenseCategories = categories.filter(c => c.type === "Expense");

  const renderCategoryList = (list: Category[], title: string, icon: React.ReactNode, emptyMessage: string) => (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
        {icon}
        <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">{title}</h3>
        <span className="ml-auto bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {list.length}
        </span>
      </div>
      
      {list.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {list.map(category => (
            <li key={category.id} className="flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
              <span className="font-medium text-zinc-900 dark:text-white">{category.name}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenModal(category)}
                  className="p-2 text-zinc-400 hover:text-emerald-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-zinc-400 hover:text-red-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Categories</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">Organize your income and expenses.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <div className="bg-zinc-100 dark:bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tags className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No categories found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto">
            You haven't added any categories yet. Create categories like "Salary", "Groceries", or "Rent".
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            + Add your first category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCategoryList(
            expenseCategories, 
            "Expense Categories", 
            <ArrowDownCircle className="h-5 w-5 text-red-500" />,
            "No expense categories yet."
          )}
          {renderCategoryList(
            incomeCategories, 
            "Income Categories", 
            <ArrowUpCircle className="h-5 w-5 text-emerald-500" />,
            "No income categories yet."
          )}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <CategoryForm 
          initialData={editingCategory} 
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
}
