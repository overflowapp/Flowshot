import Background from '../Background';

describe('Background', function() {
    it('should create a unique base session', function() {
        const s1 = Background.baseSession;
        const s2 = Background.baseSession;

        expect(s1.id).not.toEqual(s2.id);
        expect(s1.date).toEqual(s2.date);
    });

    it('should create a unique current session', function() {
        expect(Background.currentSession).toBeUndefined();

        Background.newSession();

        expect(Background.currentSession).not.toBeUndefined();
        expect(Background.currentSession).toHaveProperty('shots');
        expect(Background.currentSession.shots).toEqual([]);
    });
});
