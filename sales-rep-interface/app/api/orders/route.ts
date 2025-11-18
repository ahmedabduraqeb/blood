import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrders, getUserById } from '@/lib/db';
import { Order } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    let orders = getOrders();
    
    if (userId) {
      orders = orders.filter(order => order.userId === userId);
    }
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, website, productName, price, quantity, link, image, notes } = body;
    
    if (!userId || !website || !productName || !price || !quantity || !link) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const user = getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const orders = getOrders();
    const newOrder: Order = {
      id: Date.now().toString(),
      userId,
      userName: user.name,
      website,
      productName,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      link,
      image,
      notes,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    saveOrders(orders);
    
    return NextResponse.json({ 
      success: true, 
      order: newOrder,
      message: 'Order submitted successfully, waiting for management approval ✔'
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, userId, website, productName, price, quantity, link, image, notes } = body;
    
    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing order ID or user ID' }, { status: 400 });
    }
    
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    if (orders[orderIndex].userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to edit this order' }, { status: 403 });
    }
    
    orders[orderIndex] = {
      ...orders[orderIndex],
      website,
      productName,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      link,
      image,
      notes,
      updatedAt: new Date().toISOString()
    };
    
    saveOrders(orders);
    
    return NextResponse.json({ success: true, order: orders[orderIndex] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    
    if (!id || !userId) {
      return NextResponse.json({ error: 'Missing order ID or user ID' }, { status: 400 });
    }
    
    const orders = getOrders();
    const orderIndex = orders.findIndex(order => order.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    if (orders[orderIndex].userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this order' }, { status: 403 });
    }
    
    orders.splice(orderIndex, 1);
    saveOrders(orders);
    
    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
