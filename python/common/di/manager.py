class DependencyManager:
    def __init__(self):
        self._services = {}

    def register(self, service_class):
        instance = service_class()
        self._services[service_class] = instance

    def get(self, service_class):
        return self._services.get(service_class)

dependency_manager = DependencyManager()

def injectable(cls):
    dependency_manager.register(cls)
    return cls


def inject(service_class):
    def wrapper(func):
        def inner(self, *args, **kwargs):
            service_instance = dependency_manager.get(service_class)
            return func(self, service_instance, *args, **kwargs)
        return inner
    return wrapper
