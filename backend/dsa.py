from collections import deque


# =========================
# STACK
# =========================

class Stack:

    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if self.items:
            return self.items.pop()
        return None

    def peek(self):
        if self.items:
            return self.items[-1]
        return None

    def is_empty(self):
        return len(self.items) == 0


# =========================
# QUEUE
# =========================

class Queue:

    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        if self.items:
            return self.items.popleft()
        return None

    def is_empty(self):
        return len(self.items) == 0


# =========================
# MAX HEAP
# =========================

class MaxHeap:

    def __init__(self):
        self.heap = []

    def insert(self, item):

        self.heap.append(item)
        self._up(len(self.heap) - 1)

    def _up(self, index):

        while index > 0:

            parent = (index - 1) // 2

            if self.heap[parent]["score"] >= self.heap[index]["score"]:
                break

            self.heap[parent], self.heap[index] = \
                self.heap[index], self.heap[parent]

            index = parent

    def extract_max(self):

        if not self.heap:
            return None

        maximum = self.heap[0]
        last = self.heap.pop()

        if self.heap:

            self.heap[0] = last
            self._down(0)

        return maximum

    def _down(self, index):

        size = len(self.heap)

        while True:

            left = 2 * index + 1
            right = 2 * index + 2

            largest = index

            if (
                left < size
                and self.heap[left]["score"]
                > self.heap[largest]["score"]
            ):
                largest = left

            if (
                right < size
                and self.heap[right]["score"]
                > self.heap[largest]["score"]
            ):
                largest = right

            if largest == index:
                break

            self.heap[index], self.heap[largest] = \
                self.heap[largest], self.heap[index]

            index = largest
