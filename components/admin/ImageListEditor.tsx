'use client';

import { useState } from 'react';
import type { AreaImage } from '@/lib/areas';
import Image from 'next/image';
import { GripVertical, Star, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ImageListEditorProps {
  images: AreaImage[];
  onUpdate: (images: AreaImage[]) => void;
  onDelete: (id: string) => void;
}

function SortableImageItem({ 
  image, 
  onUpdate, 
  onDelete 
}: { 
  image: AreaImage; 
  onUpdate: (image: AreaImage) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleFieldChange = (field: keyof AreaImage, value: any) => {
    onUpdate({ ...image, [field]: value });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border-2 border-primary-200 rounded-lg p-4 mb-4"
    >
      <div className="flex gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing text-primary-400 hover:text-primary-600"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-6 h-6" />
        </button>

        {/* Image Preview */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-primary-100">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>

        {/* Fields */}
        <div className="flex-1 grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-primary-700 mb-1">
              Alt Text <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={image.alt}
              onChange={(e) => handleFieldChange('alt', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-primary-300 rounded focus:border-gold-400 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary-700 mb-1">
              Caption
            </label>
            <input
              type="text"
              value={image.caption || ''}
              onChange={(e) => handleFieldChange('caption', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-primary-300 rounded focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary-700 mb-1">
              Photo Credit
            </label>
            <input
              type="text"
              value={image.credit || ''}
              onChange={(e) => handleFieldChange('credit', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-primary-300 rounded focus:border-gold-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-primary-700 mb-1">
              Source URL
            </label>
            <input
              type="url"
              value={image.source_url || ''}
              onChange={(e) => handleFieldChange('source_url', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-primary-300 rounded focus:border-gold-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={() => handleFieldChange('featured', !image.featured)}
            className={`p-2 rounded transition ${
              image.featured
                ? 'bg-gold-100 text-gold-600 hover:bg-gold-200'
                : 'bg-primary-100 text-primary-400 hover:bg-primary-200'
            }`}
            title={image.featured ? 'Featured' : 'Set as featured'}
          >
            <Star className={`w-5 h-5 ${image.featured ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => onDelete(image.id)}
            className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded transition"
            title="Delete image"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ImageListEditor({ images, onUpdate, onDelete }: ImageListEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(img => img.id === active.id);
      const newIndex = images.findIndex(img => img.id === over.id);

      const reordered = arrayMove(images, oldIndex, newIndex);
      // Update order values
      const withOrder = reordered.map((img, index) => ({
        ...img,
        order: index
      }));
      onUpdate(withOrder);
    }
  };

  const handleImageUpdate = (updatedImage: AreaImage) => {
    const updated = images.map(img => 
      img.id === updatedImage.id ? updatedImage : img
    );
    onUpdate(updated);
  };

  if (images.length === 0) {
    return (
      <div className="text-center py-12 text-primary-500">
        <p>No images yet. Upload your first image above.</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={images.map(img => img.id)}
        strategy={verticalListSortingStrategy}
      >
        {images.map((image) => (
          <SortableImageItem
            key={image.id}
            image={image}
            onUpdate={handleImageUpdate}
            onDelete={onDelete}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}
