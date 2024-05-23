#include <iostream>
#include <time.h>

using namespace std;

template <typename T>
class list
{
private:
    struct element
    {
        T data;
        struct element *next = nullptr;
    };

    int listSize = 0;
    element *first = nullptr;

    element *getElementByIndex(unsigned int index)
    {
        if (isEmpty())
            throw "cannot return element: list is empty";
        if (index >= listSize)
            throw "accessing an element outside the list";

        element *result = first;
        for (int i = 0; i < index; i++, result = result->next)
            ;
        return result;
    }

public:
    ~list()
    {
        clear();
    }

    bool isEmpty()
    {
        return first == nullptr;
    }

    void append(T val)
    {
        if (isEmpty())
        {
            first = new element;
            first->data = val;
            listSize++;
            return;
        }

        element *last = first;
        for (; last->next != nullptr; last = last->next)
            ;
        last->next = new element;
        last->next->data = val;
        listSize++;
    }

    void pop()
    {
        if (isEmpty())
        {
            return;
        }
        if (first->next == nullptr)
        {
            delete first;
            first = nullptr;
            listSize--;
            return;
        }
        element *prelast = first;
        for (; prelast->next->next != nullptr; prelast = prelast->next)
            ;
        delete prelast->next;
        prelast->next = nullptr;
        listSize--;
    }

    T &operator[](unsigned int index)
    {
        return getElementByIndex(index)->data;
    }

    int size()
    {
        return listSize;
    }

    void clear()
    {
        if (first == nullptr) return;

        for (element *buf; first->next != nullptr;)
        {
            buf = first;
            delete first;
            first = buf->next;
        }
        delete first;
        first = nullptr;
        listSize = 0;
    }

    void append(T value, unsigned int index)
    {
        if (index == listSize - 1)
        {
            append(value);
            return;
        }
        element *elem = getElementByIndex(index);
        element *buf = elem->next;
        elem->next = new element;
        elem->next->next = buf;
        elem->next->data = elem->data;
        elem->data = value;
        listSize++;
    }

    void remove(unsigned int index)
    {
        if (index >= listSize) return;
        
        if (index == listSize - 1)
        {
            pop();
            return;
        }
        if (index == 0)
        {
            element *buf = first;
            delete first;
            first = buf->next;
            listSize--;
            return;
        }
        element *preelem = getElementByIndex(index - 1);
        element *afterelem = preelem->next->next;
        delete preelem->next;
        preelem->next = afterelem;
        listSize--;
    }

    void show()
    {
        element *curr = first;
        for (; curr != nullptr; curr = curr->next)
        {
            cout<<curr->data<<" ";
        }
    }
};

int main()
{
    srand(time(0));
    const int N = 10;

    list<int> l;
    for (int i = 0; i < N; i++)
        l.append(rand() % 51 - 25);
    l.show();
    cout << endl;


    return 0;
}