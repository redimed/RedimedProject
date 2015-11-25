//
//  rteleSignatureViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 10/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleSignatureViewController.h"
#import "NSDataAdditions.h"
#import "rteleFormS1Controller.h"

@interface rteleSignatureViewController ()

@end

@implementation rteleSignatureViewController
@synthesize drawimage;
@synthesize delegate;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    minPoint = CGPointMake(99999, 9999);
    maxPoint = CGPointMake(-99999, -9999);
    
	// Do any additional setup after loading the view.
    
    [self.drawimage setLineWidth:2.0];
    self.drawimage.foregroundLineColor = [UIColor colorWithRed:0.204 green:0.596 blue:0.859 alpha:1.000];
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
	return YES;
}
/*
- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
    
    mouseSwiped = NO;
    UITouch *touch = [touches anyObject];
    
    if ([touch tapCount] == 2) {
        drawimage.image = nil;
        return;
    }
    
    lastPoint = [touch locationInView:drawimage];
    
    //lastPoint.y -= 20;
    
    
}
- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    mouseSwiped = YES;
    
    UITouch *touch = [touches anyObject];
    CGPoint currentPoint = [touch locationInView:drawimage];
    //currentPoint.y -= 20;
    
    //NSLog(@"currentPoint - %f-%f",currentPoint.x,currentPoint.y);
    
    UIGraphicsBeginImageContext(drawimage.frame.size);
    [drawimage.image drawInRect:CGRectMake(0, 0, drawimage.frame.size.width, drawimage.frame.size.height)];
    CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
    CGContextSetLineWidth(UIGraphicsGetCurrentContext(), 5.0);
    CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), 1.0, 0.0, 0.0, 1.0);
    CGContextBeginPath(UIGraphicsGetCurrentContext());
    CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
    CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), currentPoint.x, currentPoint.y);
    CGContextStrokePath(UIGraphicsGetCurrentContext());
    drawimage.image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    lastPoint = currentPoint;
    if (lastPoint.x < minPoint.x){
        minPoint.x = lastPoint.x;
    }
    if (lastPoint.y < minPoint.y){
        minPoint.y = lastPoint.y;
    }
    if (lastPoint.x > maxPoint.x){
        maxPoint.x = lastPoint.x;
    }
    if (lastPoint.y > maxPoint.y){
        maxPoint.y = lastPoint.y;
    }
    
}
- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
    
    UITouch *touch = [touches anyObject];
    
    if ([touch tapCount] == 2) {
        drawimage.image = nil;
        return;
    }
    
    
    if(!mouseSwiped) {
        UIGraphicsBeginImageContext(drawimage.frame.size);
        [drawimage.image drawInRect:CGRectMake(0, 0, drawimage.frame.size.width, drawimage.frame.size.height)];
        CGContextSetLineCap(UIGraphicsGetCurrentContext(), kCGLineCapRound);
        CGContextSetLineWidth(UIGraphicsGetCurrentContext(), 5.0);
        CGContextSetRGBStrokeColor(UIGraphicsGetCurrentContext(), 1.0, 0.0, 0.0, 1.0);
        CGContextMoveToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextAddLineToPoint(UIGraphicsGetCurrentContext(), lastPoint.x, lastPoint.y);
        CGContextStrokePath(UIGraphicsGetCurrentContext());
        CGContextFlush(UIGraphicsGetCurrentContext());
        drawimage.image = UIGraphicsGetImageFromCurrentImageContext();
        UIGraphicsEndImageContext();
    }
}
 */
- (UIImage *)crop:(CGRect)rect {
    
    CGFloat scale = [[UIScreen mainScreen] scale];
    
    if (scale>1.0) {
        rect = CGRectMake(rect.origin.x*scale , rect.origin.y*scale, rect.size.width*scale, rect.size.height*scale);
    }
    
    CGImageRef imageRef = CGImageCreateWithImageInRect([drawimage.image CGImage], rect);
    UIImage *result = [UIImage imageWithCGImage:imageRef];
    CGImageRelease(imageRef);
    return result;
}
-(IBAction)done:(id)sender{
    //drawimage.frame = CGRectMake(minPoint.x, minPoint.y, maxPoint.x-minPoint.x, maxPoint.y-minPoint.y);
    drawimage.image = [self crop:CGRectMake(minPoint.x-15, minPoint.y-15, 30+maxPoint.x-minPoint.x, 30+maxPoint.y-minPoint.y)];
    //drawimage.image = [self crop:CGRectMake(minPoint.x-5, minPoint.y-5, 5+maxPoint.x-minPoint.x, 5+maxPoint.y-minPoint.y)];
    NSData *imagedata=[NSData dataWithData:UIImagePNGRepresentation(drawimage.image)];
    NSString *base64string = [imagedata base64Encoding];
    //NSLog(@"responseStatusString %@",base64string);
    if (base64string.length <= 0) {
        [[[UIAlertView alloc] initWithTitle:@"Warning!" message:@"Your signature is empty.\nPlease sign your signature." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
    }else{
        [[NSUserDefaults standardUserDefaults] removeObjectForKey:@"signtxt"];
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
        [defaults setValue:base64string forKey:@"signtxt"];
        //[self dismissModalViewControllerAnimated:YES];
        [self.delegate signPadController:self didSign:base64string];
    }

}

@end
