describe('Entity manager', function() {
	let entityManager;

	beforeEach(function() {
		entityManager = new EntityManager();
	});

	it('should be able to add an entity', function() {
		let previousCount = entityManager.totalEntities;
		let newCount;
		let entity = new GameEntity();

		entityManager.add(entity);
		newCount = entityManager.totalEntities;

		expect(entityManager.totalEntities - previousCount).toBe(1);
		expect(entityManager.hasEntity(entity)).toBe(true);
	});
});
