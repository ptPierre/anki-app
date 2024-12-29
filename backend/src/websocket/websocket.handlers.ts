import { Server, Socket } from 'socket.io';
import { LearningPackage } from '../models/learningPackage.model';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../routes/auth.routes';

interface PackageData {
  title: string;
  description: string;
  category: string;
  targetAudience: string;
  difficultyLevel: number;
}

export function setupWebSocketHandlers(io: Server) {
  io.use((socket, next) => {
    console.log('Auth middleware - checking token');
    const token = socket.handshake.auth.token;
    console.log('Received token:', token);

    if (!token) {
      console.log('No token provided');
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('Successfully decoded token:', decoded);
      socket.data.user = decoded;
      next();
    } catch (err) {
      console.error('Token verification failed. Token:', token, 'Error:', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('Client connected, user:', socket.data.user);

    socket.on('export-packages', async () => {
      console.log('Received export-packages event');
      try {
        const userId = socket.data.user.id;
        console.log('Fetching packages for user:', userId);
        const packages = await LearningPackage.findAll({
          where: { userId },
          raw: true
        }) as PackageData[];

        // Convert to CSV format
        const csvHeader = 'Title,Description,Category,Target Audience,Difficulty Level\n';
        const csvRows = packages.map(pkg => 
          `"${pkg.title}","${pkg.description}","${pkg.category}","${pkg.targetAudience}",${pkg.difficultyLevel}`
        ).join('\n');
        const csvContent = csvHeader + csvRows;

        // Send the CSV data back to the client
        socket.emit('export-complete', {
          data: csvContent,
          filename: `learning-packages-${new Date().toISOString()}.csv`
        });
      } catch (error) {
        console.error('Export error:', error);
        socket.emit('export-error', { message: 'Error exporting packages' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
} 