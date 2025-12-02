import { ChatMessage } from './ChatMessage';

describe('ChatMessage model', () => {
    it('should create a valid ChatMessage object', () => {
        const msg = new ChatMessage({
            id: '1',
            type: 'REFRESH_ADS',
            message: 'Hola',
            senderId: 'user1',
            senderName: 'User1',
            roomId: 'roomA',
            timestamp: Date.now().toString(),
            metadata: { level: 'info', text: 'Hola' },
            systemGenerated: false
        });
        expect(msg.id).toBe('1');
        expect(msg.type).toBe('REFRESH_ADS');
        expect(msg.message).toBe('Hola');
        expect(msg.metadata && msg.metadata['level']).toBe('info');
        expect(msg.senderId).toBe('user1');
        expect(msg.senderName).toBe('User1');
        expect(msg.roomId).toBe('roomA');
        expect(msg.systemGenerated).toBe(false);
    });

    it('should set and get properties', () => {
        const msg = new ChatMessage();
        msg.id = '2';
        msg.type = 'MAINTENANCE_MODE';
        msg.message = 'Test';
        msg.senderId = 'user2';
        msg.senderName = 'User2';
        msg.roomId = 'roomB';
        msg.timestamp = '1234567890';
        msg.metadata = { foo: 'bar' };
        msg.systemGenerated = true;
        expect(msg.id).toBe('2');
        expect(msg.type).toBe('MAINTENANCE_MODE');
        expect(msg.message).toBe('Test');
        expect(msg.senderId).toBe('user2');
        expect(msg.senderName).toBe('User2');
        expect(msg.roomId).toBe('roomB');
        expect(msg.timestamp).toBe('1234567890');
        expect(msg.metadata).toEqual({ foo: 'bar' });
        expect(msg.systemGenerated).toBe(true);
    });
    it('should handle default values and edge cases', () => {
        const msg = new ChatMessage();
        expect(msg.id).toBe('');
        expect(msg.type).toBe('REFRESH_ADS');
        expect(msg.message).toBe('');
        expect(msg.senderId).toBe('');
        expect(msg.senderName).toBe('');
        expect(msg.roomId).toBe('');
        expect(msg.timestamp).toBe('');
        expect(msg.metadata).toEqual({});
        expect(msg.systemGenerated).toBe(false);
    });

    it('should trim message and senderName', () => {
        const msg = new ChatMessage();
        msg.message = '  hello  ';
        msg.senderName = '  user  ';
        expect(msg.message).toBe('hello');
        expect(msg.senderName).toBe('user');
    });

    it('should enforce type safety for CommandMessage', () => {
        const msg = new ChatMessage();
        msg.type = 'NOTIFY';
        expect(msg.type).toBe('NOTIFY');
    });

    it('should handle null and undefined safely', () => {
        const msg = new ChatMessage();
        msg.message = null as any;
        msg.senderName = undefined as any;
        msg.metadata = undefined as any;
        expect(msg.message).toBe('');
        expect(msg.senderName).toBe('');
        expect(msg.metadata).toEqual({});
    });
});
