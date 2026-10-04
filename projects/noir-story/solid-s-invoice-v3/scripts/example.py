"""Executable source revisions for the original invoice example.

Screen snippets are symbolic state traces. These Python definitions implement
three actual source versions and run the same input through each version.
"""
import hashlib
import json

BEFORE = '''
class Invoice:
    DISCOUNT_PERCENT = 0
    HEADING = "HÓA ĐƠN"
    def total(self, items):
        subtotal = sum(price * quantity for price, quantity in items)
        return subtotal - subtotal * self.DISCOUNT_PERCENT // 100
    def render(self, total):
        return f"{self.HEADING}\\n{total:,} đồng".replace(",", ".")
'''
CALCULATOR = '''
class InvoiceCalculator:
    DISCOUNT_PERCENT = 0
    def subtotal(self, items):
        return sum(price * quantity for price, quantity in items)
    def reduction(self, subtotal):
        return subtotal * self.DISCOUNT_PERCENT // 100
    def total(self, items):
        subtotal = self.subtotal(items)
        return subtotal - self.reduction(subtotal)
'''
PRESENTER = '''
class InvoicePresenter:
    HEADING = "HÓA ĐƠN"
    def render(self, total):
        return f"{self.HEADING}\\n{total:,} đồng".replace(",", ".")
'''


def load(source):
    namespace = {}
    exec(compile(source, '<original-invoice-example>', 'exec'), namespace)
    return namespace


def run_version(sources, items):
    namespace = load('\n'.join(sources.values()))
    amount = namespace['InvoiceCalculator']().total(items)
    return namespace['InvoicePresenter']().render(amount)


def changed_modules(old, new):
    return [name for name in old if old[name] != new[name]]


def digest(text):
    return hashlib.sha256(text.encode()).hexdigest()


def verify():
    items = [(40000, 1), (30000, 2)]
    old = load(BEFORE)['Invoice']()
    initial = old.render(old.total(items))
    separated = {'calculator': CALCULATOR, 'presenter': PRESENTER}
    pricing_change = {
        **separated,
        'calculator': CALCULATOR.replace('DISCOUNT_PERCENT = 0', 'DISCOUNT_PERCENT = 10'),
    }
    heading_change = {
        **pricing_change,
        'presenter': PRESENTER.replace('HEADING = "HÓA ĐƠN"', 'HEADING = "PHIẾU THANH TOÁN"'),
    }
    assert initial == run_version(separated, items) == 'HÓA ĐƠN\n100.000 đồng'
    assert changed_modules(separated, pricing_change) == ['calculator']
    assert run_version(pricing_change, items) == 'HÓA ĐƠN\n90.000 đồng'
    assert changed_modules(pricing_change, heading_change) == ['presenter']
    assert run_version(heading_change, items) == 'PHIẾU THANH TOÁN\n90.000 đồng'
    # Check another input so the example cannot pass with a fixed display string.
    assert run_version(pricing_change, [(20000, 3)]) == 'HÓA ĐƠN\n54.000 đồng'
    return {
        'initial': initial,
        'after_refactor': run_version(separated, items),
        'discount_change': run_version(pricing_change, items),
        'heading_change': run_version(heading_change, items),
        'second_input': run_version(pricing_change, [(20000, 3)]),
        'source_hashes': {name: {module: digest(code) for module, code in sources.items()}
                          for name, sources in [('separated', separated), ('pricing', pricing_change), ('heading', heading_change)]},
        'tests': 'passed',
        'scope': 'Actual policy/heading source edits; fixed numeric-total contract; illustrative integer amounts.',
    }


if __name__ == '__main__':
    print(json.dumps(verify(), ensure_ascii=False, indent=2))
