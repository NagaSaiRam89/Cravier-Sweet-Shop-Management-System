import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Modal, ConfirmModal } from '@/components/Modal';
import { useSweets } from '@/context/SweetContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import type { Sweet, CreateSweetData, SweetCategory } from '@/types/sweet';
import { Plus, Pencil, Trash2, Package, RefreshCcw, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const categoryColors: Record<string, string> = {
  Chocolates: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  Candies: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  Cakes: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  Cookies: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  Pastries: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Ice Cream': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  Traditional: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const emptyFormData: CreateSweetData = {
  name: '',
  description: '',
  category: 'Chocolates',
  price: 0,
  quantity: 0,
  image: '',
};

export default function AdminPanel() {
  const { sweets, categories, create, update, remove, restock, refresh } = useSweets();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [formData, setFormData] = useState<CreateSweetData>(emptyFormData);
  const [restockAmount, setRestockAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const filteredSweets = sweets.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData(emptyFormData);
    setSelectedSweet(null);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Please fill in required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await create(formData);
      toast.success('Sweet added successfully');
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to add sweet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedSweet) return;
    
    setIsLoading(true);
    try {
      await update({ id: selectedSweet.id, ...formData });
      toast.success('Sweet updated successfully');
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to update sweet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSweet) return;
    
    setIsLoading(true);
    try {
      await remove(selectedSweet.id);
      toast.success('Sweet deleted successfully');
      setIsDeleteModalOpen(false);
      setSelectedSweet(null);
    } catch (error) {
      toast.error('Failed to delete sweet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestock = async () => {
    if (!selectedSweet) return;
    
    setIsLoading(true);
    try {
      await restock(selectedSweet.id, restockAmount);
      toast.success(`Added ${restockAmount} units to stock`);
      setIsRestockModalOpen(false);
      setSelectedSweet(null);
      setRestockAmount(10);
    } catch (error) {
      toast.error('Failed to restock');
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setFormData({
      name: sweet.name,
      description: sweet.description,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      image: sweet.image,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setIsDeleteModalOpen(true);
  };

  const openRestockModal = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setRestockAmount(10);
    setIsRestockModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground mt-1">
              Manage your sweet inventory
            </p>
          </div>
          
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Sweet
          </Button>
        </div>

        {/* Search & Refresh */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search sweets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <Button variant="outline" size="icon" onClick={refresh} className="rounded-xl">
            <RefreshCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-border/50 overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSweets.map((sweet, index) => (
                <TableRow key={sweet.id} className="group">
                  <TableCell className="font-medium text-muted-foreground">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={sweet.image}
                        alt={sweet.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{sweet.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                          {sweet.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn("font-medium", categoryColors[sweet.category])}>
                      {sweet.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${sweet.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-medium",
                      sweet.quantity === 0 ? "text-destructive" :
                      sweet.quantity <= 5 ? "text-warning" : "text-success"
                    )}>
                      {sweet.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openRestockModal(sweet)}
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(sweet)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => openDeleteModal(sweet)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSweets.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sweets found</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      <Modal
        open={isAddModalOpen}
        onOpenChange={(open) => { setIsAddModalOpen(open); if (!open) resetForm(); }}
        title="Add New Sweet"
        description="Fill in the details for the new sweet."
      >
        <SweetForm
          data={formData}
          onChange={setFormData}
          categories={categories}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Sweet'}
          </Button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={(open) => { setIsEditModalOpen(open); if (!open) resetForm(); }}
        title="Edit Sweet"
        description="Update the sweet details."
      >
        <SweetForm
          data={formData}
          onChange={setFormData}
          categories={categories}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEdit} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title="Delete Sweet"
        description={`Are you sure you want to delete "${selectedSweet?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        isLoading={isLoading}
        variant="destructive"
      />

      {/* Restock Modal */}
      <Modal
        open={isRestockModalOpen}
        onOpenChange={setIsRestockModalOpen}
        title="Restock Sweet"
        description={`Add stock to "${selectedSweet?.name}"`}
      >
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground">Current Stock</p>
            <p className="text-2xl font-bold text-foreground">{selectedSweet?.quantity} units</p>
          </div>
          
          <div className="space-y-2">
            <Label>Add Quantity</Label>
            <Input
              type="number"
              min={1}
              value={restockAmount}
              onChange={(e) => setRestockAmount(parseInt(e.target.value) || 0)}
              className="rounded-xl"
            />
          </div>

          <div className="p-3 rounded-xl bg-secondary">
            <p className="text-sm text-secondary-foreground">New Stock</p>
            <p className="text-2xl font-bold text-foreground">
              {(selectedSweet?.quantity || 0) + restockAmount} units
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setIsRestockModalOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleRestock} disabled={isLoading}>
            {isLoading ? 'Restocking...' : 'Restock'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

// Sweet Form Component
function SweetForm({
  data,
  onChange,
  categories,
}: {
  data: CreateSweetData;
  onChange: (data: CreateSweetData) => void;
  categories: SweetCategory[];
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange({ ...data, name: e.target.value })}
          placeholder="Sweet name"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          placeholder="Brief description"
          className="rounded-xl resize-none"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={data.category}
            onValueChange={(value) => onChange({ ...data, category: value as SweetCategory })}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price ($) *</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step={0.01}
            value={data.price}
            onChange={(e) => onChange({ ...data, price: parseFloat(e.target.value) || 0 })}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={0}
            value={data.quantity}
            onChange={(e) => onChange({ ...data, quantity: parseInt(e.target.value) || 0 })}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL</Label>
          <Input
            id="image"
            value={data.image}
            onChange={(e) => onChange({ ...data, image: e.target.value })}
            placeholder="https://..."
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
