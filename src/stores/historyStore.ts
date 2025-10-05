import localforage from 'localforage';
import type { QRHistoryItem } from '../types';

export class HistoryStore {
  private storeName = 'qr-history';
  private maxItems = 100;

  async addItem(item: Omit<QRHistoryItem, 'id' | 'timestamp'>): Promise<QRHistoryItem> {
    const historyItem: QRHistoryItem = {
      ...item,
      id: this.generateId(),
      timestamp: Date.now()
    };

    const items = await this.getItems();
    items.unshift(historyItem);

    if (items.length > this.maxItems) {
      items.splice(this.maxItems);
    }

    await localforage.setItem(this.storeName, items);
    return historyItem;
  }

  async getItems(): Promise<QRHistoryItem[]> {
    try {
      const items = await localforage.getItem<QRHistoryItem[]>(this.storeName);
      return items || [];
    } catch (error) {
      console.error('Failed to get history items:', error);
      return [];
    }
  }

  async getItem(id: string): Promise<QRHistoryItem | null> {
    try {
      const items = await this.getItems();
      return items.find(item => item.id === id) || null;
    } catch (error) {
      console.error('Failed to get history item:', error);
      return null;
    }
  }

  async deleteItem(id: string): Promise<boolean> {
    try {
      const items = await this.getItems();
      const filteredItems = items.filter(item => item.id !== id);
      await localforage.setItem(this.storeName, filteredItems);
      return true;
    } catch (error) {
      console.error('Failed to delete history item:', error);
      return false;
    }
  }

  async clearAll(): Promise<boolean> {
    try {
      await localforage.removeItem(this.storeName);
      return true;
    } catch (error) {
      console.error('Failed to clear history:', error);
      return false;
    }
  }

  async getItemsByType(type: 'created' | 'scanned'): Promise<QRHistoryItem[]> {
    try {
      const items = await this.getItems();
      return items.filter(item => item.type === type);
    } catch (error) {
      console.error('Failed to get items by type:', error);
      return [];
    }
  }

  async searchItems(query: string): Promise<QRHistoryItem[]> {
    try {
      const items = await this.getItems();
      const lowercaseQuery = query.toLowerCase();
      return items.filter(item => 
        item.data.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Failed to search items:', error);
      return [];
    }
  }

  async getItemsInDateRange(startDate: Date, endDate: Date): Promise<QRHistoryItem[]> {
    try {
      const items = await this.getItems();
      const startTime = startDate.getTime();
      const endTime = endDate.getTime();
      return items.filter(item => 
        item.timestamp >= startTime && item.timestamp <= endTime
      );
    } catch (error) {
      console.error('Failed to get items in date range:', error);
      return [];
    }
  }

  async exportHistory(): Promise<string> {
    try {
      const items = await this.getItems();
      return JSON.stringify(items, null, 2);
    } catch (error) {
      console.error('Failed to export history:', error);
      throw new Error('Failed to export history');
    }
  }

  async importHistory(jsonData: string): Promise<{ imported: number; duplicates: number }> {
    try {
      const importedItems: QRHistoryItem[] = JSON.parse(jsonData);
      const existingItems = await this.getItems();
      const existingIds = new Set(existingItems.map(item => item.id));
      
      let imported = 0;
      let duplicates = 0;

      for (const item of importedItems) {
        if (existingIds.has(item.id)) {
          duplicates++;
        } else {
          existingItems.push(item);
          imported++;
        }
      }

      existingItems.sort((a, b) => b.timestamp - a.timestamp);
      if (existingItems.length > this.maxItems) {
        existingItems.splice(this.maxItems);
      }

      await localforage.setItem(this.storeName, existingItems);
      return { imported, duplicates };
    } catch (error) {
      console.error('Failed to import history:', error);
      throw new Error('Failed to import history');
    }
  }

  async getStats(): Promise<{
    total: number;
    created: number;
    scanned: number;
    oldestItem?: QRHistoryItem;
    newestItem?: QRHistoryItem;
  }> {
    try {
      const items = await this.getItems();
      const created = items.filter(item => item.type === 'created').length;
      const scanned = items.filter(item => item.type === 'scanned').length;
      
      const sortedItems = [...items].sort((a, b) => a.timestamp - b.timestamp);
      const oldestItem = sortedItems[0];
      const newestItem = sortedItems[sortedItems.length - 1];

      return {
        total: items.length,
        created,
        scanned,
        oldestItem,
        newestItem
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      return {
        total: 0,
        created: 0,
        scanned: 0
      };
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  async updateItem(id: string, updates: Partial<QRHistoryItem>): Promise<QRHistoryItem | null> {
    try {
      const items = await this.getItems();
      const itemIndex = items.findIndex(item => item.id === id);
      
      if (itemIndex === -1) {
        return null;
      }

      items[itemIndex] = { ...items[itemIndex], ...updates };
      await localforage.setItem(this.storeName, items);
      return items[itemIndex];
    } catch (error) {
      console.error('Failed to update history item:', error);
      return null;
    }
  }
}

export const historyStore = new HistoryStore();