import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'autopartshub.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from products.models import VehicleMake, VehicleModel, VehicleYear, Engine, Category, Brand, Product
from decimal import Decimal

User = get_user_model()

# Create superuser if not exists
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@autopartshub.com', 'admin123')
    print('Superuser created: admin / admin123')
else:
    print('Superuser already exists')

# Create sample vehicle data (fewer years for speed)
makes_data = {
    'Toyota': ['Corolla', 'Camry', 'Hilux', 'Land Cruiser'],
    'Honda': ['Civic', 'Accord', 'CR-V'],
    'Nissan': ['Sunny', 'X-Trail', 'Navara'],
    'Mitsubishi': ['Lancer', 'Pajero'],
    'Subaru': ['Impreza', 'Forester'],
    'BMW': ['3 Series', '5 Series'],
    'Mercedes': ['C-Class', 'E-Class'],
    'Volkswagen': ['Golf', 'Passat'],
}

for make_name, models_list in makes_data.items():
    make, created = VehicleMake.objects.get_or_create(name=make_name, slug=make_name.lower().replace(' ', '-'))
    print(f'  Make: {make_name} ({"created" if created else "exists"})')
    for model_name in models_list:
        model, _ = VehicleModel.objects.get_or_create(make=make, name=model_name)
        for year in range(2018, 2025):
            vy, _ = VehicleYear.objects.get_or_create(vehicle_model=model, year=year)
            Engine.objects.get_or_create(vehicle_year=vy, name=f'{year % 10 + 1}.{year % 10}L Petrol')
            Engine.objects.get_or_create(vehicle_year=vy, name=f'{year % 10 + 1}.{year % 10}L Diesel')

print('Vehicle data created!')

# Create categories
categories = [
    {'name': 'Engine Parts', 'slug': 'engine-parts', 'children': ['Pistons & Rings', 'Cylinder Heads', 'Timing Belts', 'Oil Pumps']},
    {'name': 'Brakes', 'slug': 'brakes', 'children': ['Brake Pads', 'Brake Discs', 'Brake Calipers', 'Brake Shoes']},
    {'name': 'Suspension', 'slug': 'suspension', 'children': ['Shock Absorbers', 'Struts', 'Control Arms', 'Ball Joints']},
    {'name': 'Electrical', 'slug': 'electrical', 'children': ['Alternators', 'Starters', 'Batteries', 'Sensors']},
    {'name': 'Transmission', 'slug': 'transmission', 'children': ['Clutch Kits', 'Gearboxes', 'CV Joints', 'Differentials']},
    {'name': 'Cooling', 'slug': 'cooling', 'children': ['Radiators', 'Water Pumps', 'Thermostats', 'Coolant Hoses']},
    {'name': 'Exhaust', 'slug': 'exhaust', 'children': ['Exhaust Manifolds', 'Catalytic Converters', 'Mufflers', 'Pipes']},
    {'name': 'Body Parts', 'slug': 'body-parts', 'children': ['Bumpers', 'Headlights', 'Taillights', 'Mirrors']},
]

for cat_data in categories:
    parent, created = Category.objects.get_or_create(
        name=cat_data['name'],
        slug=cat_data['slug'],
        defaults={'description': f'{cat_data["name"]} category'}
    )
    for child_name in cat_data['children']:
        child_slug = child_name.lower().replace(' & ', '-').replace(' ', '-')
        Category.objects.get_or_create(
            name=child_name, slug=child_slug,
            defaults={'parent': parent, 'description': f'{child_name} - {cat_data["name"]}'}
        )

print('Categories created!')

# Create brands
brands = ['Bosch', 'Denso', 'NGK', 'Genuine', 'Febi', 'TRW', 'Brembo', 'Monroe', 'Sachs', 'Valeo', 'SKF', 'Gates']
for brand_name in brands:
    Brand.objects.get_or_create(name=brand_name, slug=brand_name.lower())

print('Brands created!')

# Sample products (load from existing categories)
from products.models import Category as CatModel
timing_belt = CatModel.objects.get(slug='timing-belts')
oil_pump = CatModel.objects.get(slug='oil-pumps')
brake_pads = CatModel.objects.get(slug='brake-pads')
brake_discs = CatModel.objects.get(slug='brake-discs')
shock = CatModel.objects.get(slug='shock-absorbers')
alternator = CatModel.objects.get(slug='alternators')
clutch = CatModel.objects.get(slug='clutch-kits')
engine_parts = CatModel.objects.get(slug='engine-parts')

from products.models import Brand as BrandModel
bosch = BrandModel.objects.get(name='Bosch')
denso = BrandModel.objects.get(name='Denso')
ngk = BrandModel.objects.get(name='NGK')
brembo = BrandModel.objects.get(name='Brembo')
monroe = BrandModel.objects.get(name='Monroe')
valeo = BrandModel.objects.get(name='Valeo')
febi = BrandModel.objects.get(name='Febi')

sample_products = [
    {'name': 'Toyota Corolla Timing Belt Kit', 'slug': 'toyota-corolla-timing-belt-kit', 'sku': 'TBT-001', 'oem': '13568-0Y010', 'cat': timing_belt, 'brand': bosch, 'price': 4500, 'stock': 25, 'condition': 'OEM', 'desc': 'Complete timing belt kit for Toyota Corolla 1.8L. Includes belt, tensioner, and idler pulley.'},
    {'name': 'Bosch Brake Pads Set', 'slug': 'bosch-brake-pads-set', 'sku': 'BP-BOSCH-001', 'oem': '04465-06180', 'cat': brake_pads, 'brand': bosch, 'price': 2800, 'stock': 50, 'condition': 'OEM', 'desc': 'Premium ceramic brake pads for most Japanese vehicles. Low dust, quiet operation.'},
    {'name': 'Brembo Brake Discs (Pair)', 'slug': 'brembo-brake-discs-pair', 'sku': 'BD-BREMBO-001', 'oem': '43512-0D010', 'cat': brake_discs, 'brand': brembo, 'price': 8500, 'stock': 15, 'condition': 'AFTERMARKET', 'desc': 'High-performance ventilated brake discs. Direct fit for Toyota Hilux.'},
    {'name': 'Monroe Shock Absorber', 'slug': 'monroe-shock-absorber', 'sku': 'SH-MONROE-001', 'oem': '48530-69165', 'cat': shock, 'brand': monroe, 'price': 5200, 'stock': 30, 'condition': 'AFTERMARKET', 'desc': 'Gas-charged shock absorber for comfortable ride and superior handling.'},
    {'name': 'NGK Spark Plugs (Set of 4)', 'slug': 'ngk-spark-plugs-set-4', 'sku': 'SP-NGK-001', 'oem': '90919-01150', 'cat': engine_parts, 'brand': ngk, 'price': 2400, 'stock': 100, 'condition': 'OEM', 'desc': 'Iridium IX spark plugs. Longer life and better fuel economy.'},
    {'name': 'Denso Alternator', 'slug': 'denso-alternator', 'sku': 'ALT-DENSO-001', 'oem': '27060-0T010', 'cat': alternator, 'brand': denso, 'price': 18500, 'stock': 8, 'condition': 'GENUINE', 'desc': '100A alternator for Toyota Camry. Direct replacement with 12-month warranty.'},
    {'name': 'Valeo Clutch Kit', 'slug': 'valeo-clutch-kit', 'sku': 'CK-VALEO-001', 'oem': '31250-0K020', 'cat': clutch, 'brand': valeo, 'price': 12500, 'stock': 12, 'condition': 'OEM', 'desc': 'Complete clutch kit including pressure plate, disc, and release bearing.'},
    {'name': 'Oil Pump Assembly', 'slug': 'oil-pump-assembly', 'sku': 'OP-001', 'oem': '15100-0H010', 'cat': oil_pump, 'brand': denso, 'price': 6800, 'stock': 20, 'condition': 'OEM', 'desc': 'High-pressure oil pump for Nissan engines. Ensures proper lubrication.'},
]

for sp in sample_products:
    product, created = Product.objects.get_or_create(
        sku=sp['sku'],
        defaults={
            'name': sp['name'],
            'slug': sp['slug'],
            'oem_number': sp['oem'],
            'category': sp['cat'],
            'brand': sp['brand'],
            'price': sp['price'],
            'stock': sp['stock'],
            'condition': sp['condition'],
            'description': sp['desc'],
            'short_description': sp['desc'][:100],
            'is_featured': True,
        }
    )
    if created:
        print(f'  Created: {product.name}')
    else:
        print(f'  Exists: {product.name}')

print('Done!')
print('Admin login: admin / admin123')
