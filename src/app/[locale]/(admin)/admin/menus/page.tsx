"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus } from 'lucide-react';

function SortableItem({ id, item }: { id: string, item: any }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 mb-2 rounded-md border shadow-sm">
      <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600">
        <GripVertical className="h-5 w-5" />
      </div>
      <div className="flex-1 font-medium text-slate-700 dark:text-slate-200">{item.title_id}</div>
      <div className="text-sm text-slate-500">{item.url}</div>
      <Button variant="outline" size="sm" className="text-blue-600">Edit</Button>
    </div>
  );
}

export default function MenuBuilderPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchMenus = async () => {
    try {
      const res = await axios.get('/api/menus');
      if (res.data.success) {
        setMenus(res.data.data.map((m: any) => ({ ...m, id: m.id.toString() })));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = menus.findIndex((m) => m.id === active.id);
      const newIndex = menus.findIndex((m) => m.id === over.id);
      
      const newItems = arrayMove(menus, oldIndex, newIndex);
      setMenus(newItems);

      // Save order to DB
      const itemsToUpdate = newItems.map((item, index) => ({
        id: parseInt(item.id),
        order_index: index,
        parent_id: item.parent_id
      }));

      try {
        await axios.put('/api/menus', { items: itemsToUpdate });
      } catch (error) {
        console.error("Failed to update menu order");
      }
    }
  };

  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/menus', {
        title_id: newTitle,
        title_en: newTitle, // Simplified for demo
        title_ar: newTitle,
        url: newUrl,
      });
      setNewTitle('');
      setNewUrl('');
      fetchMenus();
    } catch (error) {
      console.error("Failed to add menu");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Menu Builder (Drag & Drop)</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Struktur Menu Frontend</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading menus...</p>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={menus.map(m => m.id)} strategy={verticalListSortingStrategy}>
                    {menus.map((menu) => (
                      <SortableItem key={menu.id} id={menu.id} item={menu} />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Tambah Menu Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMenu} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Menu</Label>
                  <Input 
                    id="title" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="Contoh: Profil" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL Tujuan</Label>
                  <Input 
                    id="url" 
                    value={newUrl} 
                    onChange={(e) => setNewUrl(e.target.value)} 
                    placeholder="Contoh: /profil" 
                    required 
                  />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" /> Tambah
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
