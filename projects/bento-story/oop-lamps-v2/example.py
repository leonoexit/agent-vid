class Lamp:
    def __init__(self):
        self.on = False

    def turn_on(self):
        self.on = True

desk = Lamp()
bed = Lamp()
assert desk is not bed
assert desk.on is False and bed.on is False
desk.turn_on()
assert desk.on is True and bed.on is False
print({"desk.on": desk.on, "bed.on": bed.on})
