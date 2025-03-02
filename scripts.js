// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    
    if (burger) {
        burger.addEventListener('click', function() {
            nav.classList.toggle('nav-active');
            
            // Burger animation
            burger.classList.toggle('toggle');
        });
    }
    
    // Initialize visualizations only on the home page
    if (document.getElementById('token-cloud') && document.getElementById('neural-network')) {
        initTokenCloud();
        initNeuralNetwork();
    }
});

// Token Cloud Visualization
function initTokenCloud() {
    const container = document.getElementById('token-cloud');
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // AI-related terms for the token cloud
    const tokens = [
        'AI', 'Machine Learning', 'Neural Networks', 'Deep Learning', 'NLP',
        'Computer Vision', 'Algorithms', 'Data Science', 'Robotics', 'Automation',
        'Predictive Analytics', 'Big Data', 'Cognitive Computing', 'Reinforcement Learning',
        'Supervised Learning', 'Unsupervised Learning', 'TensorFlow', 'PyTorch', 'Keras',
        'Transformers', 'GPT', 'BERT', 'Computer Vision', 'Speech Recognition'
    ];
    
    // Create SVG container
    const svg = d3.select('#token-cloud')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create token elements
    const tokenElements = tokens.map((text, i) => {
        return {
            text,
            x: Math.random() * width,
            y: Math.random() * height,
            size: 10 + Math.random() * 20,
            color: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.7})`,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2
        };
    });
    
    // Add tokens to SVG
    const tokenNodes = svg.selectAll('text')
        .data(tokenElements)
        .enter()
        .append('text')
        .text(d => d.text)
        .attr('x', d => d.x)
        .attr('y', d => d.y)
        .attr('font-size', d => `${d.size}px`)
        .attr('fill', d => d.color)
        .style('font-weight', 'bold');
    
    // Animation function
    function animate() {
        tokenNodes
            .each(function(d) {
                d.x += d.speedX;
                d.y += d.speedY;
                
                // Bounce off edges
                if (d.x < 0 || d.x > width) d.speedX *= -1;
                if (d.y < 0 || d.y > height) d.speedY *= -1;
            })
            .attr('x', d => d.x)
            .attr('y', d => d.y);
        
        requestAnimationFrame(animate);
    }
    
    // Start animation
    animate();
}

// Neural Network Visualization
function initNeuralNetwork() {
    const container = document.getElementById('neural-network');
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Create SVG container
    const svg = d3.select('#neural-network')
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Define neural network structure
    const layers = [
        { nodes: 8, x: width * 0.2 },
        { nodes: 12, x: width * 0.4 },
        { nodes: 12, x: width * 0.6 },
        { nodes: 6, x: width * 0.8 }
    ];
    
    // Create nodes
    let allNodes = [];
    
    layers.forEach((layer, layerIndex) => {
        const nodes = [];
        const spacing = height / (layer.nodes + 1);
        
        for (let i = 0; i < layer.nodes; i++) {
            nodes.push({
                x: layer.x,
                y: spacing * (i + 1),
                layer: layerIndex
            });
        }
        
        allNodes = allNodes.concat(nodes);
    });
    
    // Create connections between layers
    const connections = [];
    
    for (let i = 0; i < layers.length - 1; i++) {
        const currentLayerNodes = allNodes.filter(node => node.layer === i);
        const nextLayerNodes = allNodes.filter(node => node.layer === i + 1);
        
        currentLayerNodes.forEach(source => {
            nextLayerNodes.forEach(target => {
                connections.push({
                    source,
                    target,
                    strength: Math.random()
                });
            });
        });
    }
    
    // Draw connections
    svg.selectAll('line')
        .data(connections)
        .enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', d => `rgba(255, 255, 255, ${d.strength * 0.5})`)
        .attr('stroke-width', d => d.strength * 2);
    
    // Draw nodes
    svg.selectAll('circle')
        .data(allNodes)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', 5)
        .attr('fill', 'rgba(255, 255, 255, 0.8)');
    
    // Add pulse animation to nodes
    function pulseNodes() {
        svg.selectAll('circle')
            .transition()
            .duration(1500)
            .attr('r', () => 3 + Math.random() * 4)
            .transition()
            .duration(1500)
            .attr('r', 5)
            .on('end', pulseNodes);
    }
    
    // Add data flow animation to connections
    function animateConnections() {
        // Select random connections to animate
        const activeConnections = connections
            .filter(() => Math.random() > 0.7)
            .map(conn => ({
                ...conn,
                progress: 0
            }));
        
        if (activeConnections.length === 0) {
            setTimeout(animateConnections, 500);
            return;
        }
        
        // Create data particles
        const particles = svg.selectAll('circle.particle')
            .data(activeConnections)
            .enter()
            .append('circle')
            .attr('class', 'particle')
            .attr('r', 2)
            .attr('fill', 'white');
        
        // Animate particles along connections
        function updateParticles() {
            particles
                .attr('cx', d => d.source.x + (d.target.x - d.source.x) * d.progress)
                .attr('cy', d => d.source.y + (d.target.y - d.source.y) * d.progress);
            
            activeConnections.forEach(d => {
                d.progress += 0.02;
            });
            
            if (activeConnections.some(d => d.progress < 1)) {
                requestAnimationFrame(updateParticles);
            } else {
                particles.remove();
                setTimeout(animateConnections, 500);
            }
        }
        
        updateParticles();
    }
    
    // Start animations
    pulseNodes();
    animateConnections();
}