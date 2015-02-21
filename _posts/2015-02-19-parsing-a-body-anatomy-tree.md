---
layout: post
title: Parsing a Body Anatomy Tree
---

Recently I finished working on constructing a human body tree so that relations extracted from the [Knowledge Extraction](https://github.com/crea-berkeley/relation-extraction) project could be associated with parts of the human body. In this blog post I would like to discuss the process I went through to decode a text file that encodes information about the anatomy of the human body and produce a JSON file representing this hierarchical structure.

The input file that encodes the various parts of the human body, from larger components such as organs to smaller components such as cells, is a text file of unknown format. I will refer to this file as the *tree* file from this point onwards. The tree file was produced a while ago and nobody remembers exactly how it was encoded. The only other hint is that there is a PHP script that the author made to work with this file, so it might provide a clue on how to decode the tree. Here is a snippet of the tree file:

```
a:2:{i:0;a:3014:{i:0;a:10:{i:0;a:1:{i:0;s:12:"body anatomy";}i:1;i:3014;i:2;a:3:{i:0;i:817;i:1;i:2374;i:2;i:2437;}i:3;i:0;i:4;s:1:"0";i:7;i:0;i:8;s:0:"";s:14:"default_parent";N;s:3:"sex";s:1:"m";s:13:"node_keywords";a:1:{s:4:"body";a:0:{}}}i:156;a:11:{i:0;a:1:{i:0;s:13:"palatine bone";}i:1;a:2:{i:0;s:3:"971";i:1;s:3:"642";}i:2;a:4:{i:0;i:2333;i:1;i:2342;i:2;i:2343;i:3;s:4:"2332";}i:3;i:0;i:4;s:1:"0";i:6;s:1:"0";i:7;i:0;i:8;s:0:"";s:14:"default_parent";s:3:"971";s:15:"parent_keywords";a:2:{i:971;a:3:{i:0;s:4:"bone";i:1;s:11:"facial bone";i:2;s:8:"skeleton";}i:642;a:1:{i:0;s:6:"palate";}}...
```

The entire file is approximately 1 megabyte large. By simply looking at this file, one can decipher a small amount of information. For example, the ‘i’ seems to refer to a node id, the number following ‘s:’ seems to refer to the length of the string following it, and braces likely indicate some parent-child relationship. But I wanted to work with this file in a more straightforward manner with less hypothesizing about what the syntax meant, so I looked at the PHP script for some inspiration. The decision proved to be helpful as I found out that this is not an arbitrary format that the author came up with him or herself, but rather it is how PHP serializes objects. These were the lines in the PHP file that led to my realization:

```php
$str = implode("", file($tree_files_dir.$this->name));
$this->nodes = unserialize($str);
$this->nodes_hash = array();
```
I decided to write the program that produced the final JSON output in either Python or Java. The initial approach that I took when I discovered the tree file is in a serialized PHP format was I found libraries that can parse this PHP file into native objects in the languages I will be working in, such as [phpserialize](https://pypi.python.org/pypi/phpserialize) for Python and [pherialize](https://github.com/kayahr/pherialize) for Java. Later however I decided to modify the PHP script to produce a JSON output that I can then work with directly instead of using external libraries to parse the serialized PHP objects. Note that this intermediate structure, although it is in JSON, still needs to be processed because it is a flattened tree. Here is a snippet of this flattened tree structure:

```json
{
    "0": {
        "0": [
            "body anatomy"
        ],
        "1": 3014,
        "2": [
            817,
            2374,
            2437
        ],
        "3": 0,
        "4": "0",
        "7": 0,
        "8": "",
        ...
    },
   ...
}
```

Each node is keyed by its ID and here are its most important key value pairs:

- “0”: A list of names for this node.
- “1”: A list of parents for this node. Note that the root node is an exception, where it is an integer representing the number of types of child nodes.
- “2”: A list of children for this node.

With the structure of the flat tree known, the next step would be devise an algorithm to construct the tree which would convert this flat structure into a hierarchical structure mirroring the hierarchical organization of organs, tissues, cells, etc.. Algorithms that naturally come to mind are based on the ideas of depth-first search and breadth-first search. The difference here is that instead of a search, we are constructing the tree from the root node either using a depth-first or breadth-first approach. I picked a depth-first approach but breadth-first approach can work as well.

In the depth-first tree construction strategy, recursion is used just as in depth-first search. The base case is when a node has no children, in which the function returns. The recursive step is to nest the nodes identified by the child IDs of the current node in the current node itself, and repeat this for its children. For example, if the current node has two children, with IDs 983 and 156, which refers to *maxillary bone* and *palatine bone* respectively, the current step would put the nodes that correspond with the *maxillary bone* and *palatine bone* as children nested inside the current node, instead of just having a the node IDs 983 and 156 referring to the children. Here are some figures to illustrate this action:

At the beginning of the current recursion level, our node could look like this:

```json
{
    "id": 642,
    "names": ["hard palate"],
    "children": [983, 156]
}
```

At the end of the current recursion level, our node could look like this:

```json
{
    "id": 642,
    "names": ["hard palate"],
    "children": [
        {
            "id": 983,
            "names": ["maxilla", "maxillary bone"],
            "children": [...]
        },
        {
            "id": 156,
            "names": ["palatine bone"],
            "children": [...]
        }
    ]
}
```


Now that we have an algorithm, we could feed it the input and see if it can successfully output the JSON in the format we want. I implemented the algorithm in Java in the end. What I observed, however, was that the recursion never stops, and will eventually exceed the maximum stack size. After some time investigating the cause, I determined that the structure that I thought was a tree actually contains cycles. I kept track of the frequency of the visits to each node ID while debugging the infinite recursion, and discovered that there are a few nodes with thousands of visits while others have 0 after around a bound number of recursive steps (~100000). Here is an example of a cycle:

```json
{
    "id": 642,
    "names": ["hard palate"],
    "children": [
        {
            "id": 2855,
            "names": ["palatal process", "palatine process"],
            "children": [642, 2858, 2859]
        }
    ]
}
```

Note that the node with ID 2855 has a child that has the same ID as its parent.

The way this can be solved is by keeping track of all the ancestors of a node as we are traversing down the tree we are constructing by ID. If we detect that a child has the same ID as an ancestor we can stop recursing on that child, indicate we have encountered a cycle, and continue on. With this change, the program can terminate successfully.

Source files for the body anatomy tree constructor can be found at: [https://github.com/crea-berkeley/crea-anatomy-tree-builder](https://github.com/crea-berkeley/crea-anatomy-tree-builder).
