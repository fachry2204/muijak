"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Plus } from 'lucide-react';

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name_id: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const slug = form.name_id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (editId) {
        await axios.put(`/api/categories/${editId}`, { name_id: form.name_id, slug });
      } else {
        await axios.post('/api/categories', { name_id: form.name_id, slug });
      }
      setForm({ name_id: '' });
      setEditId(null);
      fetchCategories();
    } catch (error) {
      console.error('Failed to save category');
      alert('Gagal menyimpan kategori');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        await axios.delete(`/api/categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert('Gagal menghapus kategori');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Manajemen Kategori Berita</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Add Category */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editId ? 'Edit Kategori' : 'Tambah Kategori'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name_id">Nama Kategori *</Label>
                  <Input 
                    id="name_id" 
                    required 
                    value={form.name_id} 
                    onChange={e => setForm({...form, name_id: e.target.value})} 
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    {editId ? 'Perbarui Kategori' : <><Plus className="w-4 h-4 mr-2" /> Simpan Kategori</>}
                  </Button>
                  {editId && (
                    <Button type="button" variant="outline" onClick={() => { setEditId(null); setForm({ name_id: '' }); }} className="w-full">
                      Batal
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* List Categories */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading categories...</div>
              ) : (
                <div className="border rounded-md">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th className="px-4 py-3 font-medium text-slate-500">ID</th>
                        <th className="px-4 py-3 font-medium text-slate-500">Kategori</th>
                        <th className="px-4 py-3 font-medium text-slate-500 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {categories.map((cat) => (
                        <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3">{cat.id}</td>
                          <td className="px-4 py-3 font-bold text-slate-800">{cat.name_id}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button onClick={() => { setEditId(cat.id); setForm({ name_id: cat.name_id }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} variant="outline" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200">
                                <Pencil className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button onClick={() => handleDelete(cat.id)} variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Belum ada kategori yang ditambahkan.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
