#include <iostream>
#include <time.h>

using namespace std;

template <typename T>
class BinTree
{
private:
    
    struct _node
    {
        T data;
        _node* left = nullptr;
        _node* right = nullptr;
        _node* parent = nullptr;
    };  
    
    _node *root = nullptr;
    
    void _append(T value, _node *branch)
    {
        if(isEmpty())
        {
            root = new _node;
            root->data = value;
            return;
        }
        
        if(value <= branch->data)
        {
            if(branch->left == nullptr)
            {
                branch->left = new _node;
                branch->left->data = value;
                branch->left->parent = branch;
                return;
            }
            _append(value, branch->left);
        }
        else
        {
            if(branch->right == nullptr)
            {
                branch->right = new _node;
                branch->right->data = value;
                branch->right->parent = branch;
                return;
            }
            _append(value, branch->right);
        }
        
    }
    
    void _remove(_node* branch, T val)
    {
        // когда это лист
        if(branch->left == nullptr && branch->right == nullptr)
        {
            if(branch == root)
            {
                cout<<"root remove leaves";
                delete root;
                root = nullptr;
                return;
            }
            
            
            if(branch == branch->parent->left)
            {
                branch->parent->left = nullptr;
            }
            else
            {
                branch->parent->right = nullptr;
            }
            
            delete branch;      
            return;
        }
        
        //когда только 1 поддерево  
        if((branch->left == nullptr && branch->right != nullptr) || (branch->left != nullptr && branch->right == nullptr))
        {
            bool onLeft = branch->left != nullptr ? 1 : 0;
            _node* next = onLeft ? branch->left : branch->right;
        
            if(branch == root)
            {
                cout<<"root remove 1tree";  
                delete root;
                root = next;
                return;
            }
            
            
            if(branch == branch->parent->left)
            {
                branch->parent->left = next;
            }
            else
            {
                branch->parent->right = next;
            }
            delete branch;
            return;
        }
        
        //когда 2 поддерева
        cout<<"remove with 2 branches";
        _node* min = branch->right;
        for(; min->left != nullptr; min = min->left);
        if(branch->right == min) // чтобы правильно перенеслось значение, в случае, если не прошла ни одна итерация 
        {
            branch->data = min->data;
            delete min;
            branch->right = nullptr;
            return;
        }
        //если у минимального значения есть ветка
        if(min->right != nullptr)
        {
            min->parent->left = min->right;
        }
        else
        {
            min->parent->left = nullptr;
        }
        branch->data = min->data;
        delete min;
    }
    
    
    void _show(_node* branch)
    {
        if(isEmpty())
        {
            cout<<"NO ELEMENTS";
            return;
        }
        if(branch==nullptr) {return;}
        
        _show(branch->left);
        cout<<branch->data<<" ";
        _show(branch->right);
    }
    
    void _deleteBranches(_node* branch)
    {
        if(branch==nullptr) {return;}
        _deleteBranches(branch->left);
        _deleteBranches(branch->right);
        delete branch;
    }
    
    _node* _getNode(T value, _node* branch)
    {
        if(branch == nullptr)
            {throw "doesn't exist";}
            
        if(branch->data == value)
            {return branch;}
           
        
        
        if(value < branch->data)
            {return _getNode(value, branch->left);}
        else
            {return _getNode(value, branch->right);}

    }
    
    _node* _getNodeBeforeVal(T value, _node* branch)
    {
        if(branch == nullptr)
            {throw "doesn't exist";}
        if(branch == root && root->data == value)
            {return root;}
            
        if(branch->left->data == value && branch->left != nullptr)
            {return branch;}
        else if(branch->right->data == value && branch->right != nullptr)
            {return branch;}
            
        if(value < branch->data)
            {_getNodeBeforeVal(value, branch->left);}
        else
            {_getNodeBeforeVal(value, branch->right);}
    }
    
    int count_of_levels(_node* branch)
    {
        if(branch == nullptr)
            {return 0;}
        int leftCount = count_of_levels(branch->left), rightCount = count_of_levels(branch->right);
        return 1 + (leftCount > rightCount ? leftCount : rightCount);
    }
    
    int _leavesCountOnLevel(int lvl, _node* branch, int currI = 0)
    {
        if(branch == nullptr)
            {return 0;}
            
        if(currI == lvl)
        {
            if(branch->left == nullptr && branch->right == nullptr)
                return 1;
            return 0;
        }
        return _leavesCountOnLevel(lvl, branch->left, currI+1) + _leavesCountOnLevel(lvl, branch->right, currI+1); 
    }

    
public:   

    ~BinTree()
    {
        _deleteBranches(root);
    } 
    
    bool isEmpty()
    {
        return root == nullptr;
    }
    
    void append (T val)
    {
        _append(val, root);
    }
    
    void remove(T val)
    {
        _remove(_getNode(val, root), val);
    }
    
    void show()
    {
        _show(root);
        cout<<endl;
    }
    
    T getValue(T value)
    {
        return _getNode(value, root)->data;
    }
    
    _node* getroot()
    {
        return root;
    }
    
    int levelsCount()
    {
        return count_of_levels(root);
    }
    
    int leavesCountOnLevel(int lvl)
    {
        return _leavesCountOnLevel(lvl, root);
    }
    
};






int main()
{
    srand(time(0));

    BinTree<int> tree;
    const int N = 10;
    for(int i = 0; i < N; i++)
    {
        tree.append(rand() % 51 - 25);
    }
    /*tree.append(6);
    tree.append(4);
    tree.append(7);
    tree.append(5);
    tree.append(3);*/
    
    tree.show();
    cout<<endl;
    
    int levels = tree.levelsCount();
    cout<<"levels count: "<<levels<<endl;
    for(int i=0; i<levels; i++)
    {
        cout<<"leaves on "<<i+1<<" level: "<<tree.leavesCountOnLevel(i)<<endl;
    }
    
    return 0;
}